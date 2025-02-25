import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/auth/auth.controller';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { SmsService } from 'src/auth/sms.service';
import { Otp } from './auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          process.env.JWT_SECRET || 'defaultSecret',
        ),
        signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SmsService],
})
export class AuthModule {}
