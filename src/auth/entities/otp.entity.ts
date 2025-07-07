import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ nullable: true, default: false })
  is_used: boolean;

  @Column({ type: 'timestamp' })
  expirationTime: Date;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;
}
