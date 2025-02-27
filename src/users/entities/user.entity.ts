import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ad } from '../../ad/entities/ad.entity';
import { Chat } from 'entities/chat.entity';
import { Otp } from '../../auth/entities/otp.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  role: UserRole;

  @OneToMany(() => Ad, (ad) => ad.seller)
  ads: Ad[];

  // @OneToMany(() => Chat, (chat) => chat.buyer)
  // chatsAsBuyer: Chat[];

  // @OneToMany(() => Chat, (chat) => chat.seller)
  // chatsAsSeller: Chat[];

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
}

export type UserRole = 'ADMIN' | 'USER';