import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ad } from '../entities/ad.entity';
import { Chat } from '../entities/chat.entity';
import { Otp } from '../auth/auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  role: Role;

  @OneToMany(() => Ad, (ad) => ad.seller)
  ads: Ad[];

  @OneToMany(() => Chat, (chat) => chat.buyer)
  chatsAsBuyer: Chat[];

  @OneToMany(() => Chat, (chat) => chat.seller)
  chatsAsSeller: Chat[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
}

type Role = 'ADMIN' | 'USER';