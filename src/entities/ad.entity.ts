import { Column, CreateDateColumn, Entity, ManyToOne, Point, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity()
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('jsonb')
  images: string[];

  @ManyToOne(() => Category)
  category: Category;

  @Column('jsonb')
  customFields: Record<string, any>;

  @Column('geography', { spatialFeatureType: 'Point', nullable: true })
  location: Point;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column({nullable: true})
  state: string;

  @Column('jsonb')
  price: { type: 'fixed' | 'negotiable'; value?: number };

  @ManyToOne(() => User)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;
}