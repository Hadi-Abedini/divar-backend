import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ad } from './ad.entity';
import { Chat } from './chat.entity';

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
}

type Role = 'ADMIN' | 'USER';
