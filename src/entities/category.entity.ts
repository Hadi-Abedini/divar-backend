import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;
  
  @Column({ nullable: true })
  icon: string;

  @TreeParent()
  @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'CASCADE' })
  parent: Category | null;

  @TreeChildren()
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ default: 0 })
  depth: number;

  @Column('jsonb', { nullable: true })
  customFields: FieldDefinition[];
}

interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
}