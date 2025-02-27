import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  phone: string;
  role: UserRole;
  refreshToken?: string;
}
