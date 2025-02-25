import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Otp } from 'src/auth/auth.entity';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private smsService: SmsService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<string> {
    let user = await this.userRepository.findOne({ where: { phone: phone } });

    if (!user) {
      user = this.userRepository.create({ phone: phone });
      await this.userRepository.save(user);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const otpEntity = this.otpRepository.create({
      otpCode: otp,
      expirationTime,
      user,
    });
    await this.otpRepository.save(otpEntity);

    await this.smsService.sendOtp(phone, otp);

    return 'OTP sent successfully';
  }

  async verifyOtp(phone: string, otp: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { phone: phone }, relations: ['otps'] });

    if (!user) {
      throw new Error('User not found');
    }

    const userOtp = user.otps.find((otpEntity) => otpEntity.otpCode === otp);
    if (!userOtp || userOtp.expirationTime < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    await this.userRepository.save(user);

    const accessToken = this.jwtService.sign({ userId: user.id }, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN });

    const refreshToken = this.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return accessToken;
  }

  generateRefreshToken(user: User): string {
    const payload = { userId: user.id };
    const refreshToken = this.jwtService.sign(payload, { 
      secret: process.env.JWT_REFRESH_SECRET, 
      expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN 
    });
    return refreshToken;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    let userId: string;

    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      userId = payload.userId;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign({ userId: user.id }, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN });
    return newAccessToken;
  }
}