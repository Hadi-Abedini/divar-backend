import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async isAdminExists(): Promise<boolean> {
    const admin = await this.userRepository.findOne({ where: { role: 'ADMIN' } });
    return !!admin;
  }

  async createAdminUser(): Promise<User> {
    const admin = this.userRepository.create({
      phone: '09012345678',
      role: 'ADMIN',
      isVerified: true,
      refreshToken: undefined, 
    });
    console.log('Admin user created');
    
    return this.userRepository.save(admin);
  }
}