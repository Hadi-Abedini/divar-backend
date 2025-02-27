import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = await this.userRepository.create(data);
    this.userRepository.save(user);
  }

  async verifyUser(data: CreateUserDto) {
    const user = await this.userRepository.create(data);
    this.userRepository.save(user);
  }

  async findUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async findUserAdmin() {
    return await this.userRepository.findOne({ where: { role: 'ADMIN' } });
  }

  async createAdmin() {
    const admin = await this.userRepository.create({
      phone: '09012345678',
      role: 'ADMIN',
      refreshToken: undefined,
    });
    return await this.userRepository.save(admin);
  }
}
