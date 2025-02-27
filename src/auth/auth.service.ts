import { HttpException, Injectable } from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,

    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(data: AuthenticateDto) {
    const user = await this.userService.findUserByPhone(data.phone);

    if (!user) {
      await this.userService.createUser({
        phone: data.phone,
        role: 'USER',
        refreshToken: undefined,
      });
    }

    return await this.generate_code(data);
  }

  async generate_code(data: AuthenticateDto) {
    const user = await this.userService.findUserByPhone(data.phone);
    const otp = await this.otpRepository.findOne({
      where: { user: { phone: data.phone } },
    });

    if (!user) {
      throw new HttpException('server error', 500);
    }

    if (!!otp && otp.expirationTime > new Date()) {
      throw new HttpException(
        'OTP already requested. Please wait for it to expire.',
        400,
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const otpEntity = await this.otpRepository.create({
      code,
      expirationTime,
      user,
    });
    await this.otpRepository.save(otpEntity);

    // // await this.smsService.sendOtp(phone, otp);

    return { phone: data.phone, code: code };
  }

  async verify_code(data: VerifyOtpDto) {
    const user = await this.userService.findUserByPhone(data.phone);
    const otps = await this.otpRepository.find({
      where: { user: { phone: data.phone } },
    });

    if (!user) {
      throw new HttpException('server error', 500);
    }

    const otp = otps.find((otp) => otp.code === data.code);

    if (!otp || otp.expirationTime < new Date()) {
      throw new HttpException('Invalid or expired OTP', 400);
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, phone: data.phone },
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN || '1d' },
    );

    const refreshToken = this.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  generateRefreshToken(user: User): string {
    const refreshToken = this.jwtService.sign(
      { userId: user.id, phone: user.phone },
      {
        secret:
          process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-key',
        expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN || '7d',
      },
    );
    return refreshToken;
  }

  async refreshToken(refreshToken: string) {
    let userId: string;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      userId = payload.userId;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    );
    return newAccessToken;
  }

  logout() {
    return 'This action adds a new auth';
  }
}
