import { User } from "src/users/entities/user.entity";

export class GenerateOtpDto {
  phone: string;
  user: User;
}
