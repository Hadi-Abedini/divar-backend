import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Otp])],
  controllers: [AuthController],
  providers: [AuthService,UsersService],
})
export class AuthModule {}
