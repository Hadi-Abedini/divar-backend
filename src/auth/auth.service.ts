import { HttpException, Injectable } from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private readonly userService: UsersService,
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
      throw new HttpException('OTP already requested. Please wait for it to expire.', 400);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 2);

    const otpEntity = await this.otpRepository.create({
      code,
      expirationTime,
      user,
    });
    await this.otpRepository.save(otpEntity);

    // // await this.smsService.sendOtp(phone, otp);

    return { phone: data.phone, code: code };
  }

  verify_code(CodeAuthDto: VerifyOtpDto) {
    return 'This action adds a new auth';
  }

  refresh_token() {
    return 'This action adds a new auth';
  }

  logout() {
    return 'This action adds a new auth';
  }
}
