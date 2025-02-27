// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Otp } from 'src/api/auth/entities/otp.entity';
// import { User } from 'src/api/users/entities/user.entity';
// import { AuthController } from 'auth/auth.controller';
// import { AuthService } from 'auth/auth.service';
// import { SmsService } from 'auth/sms.service';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Otp, User]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>(
//           process.env.JWT_SECRET || 'defaultSecret',
//         ),
//         signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, SmsService],
// })
// export class AuthModule {}
