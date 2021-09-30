import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entitites/user.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: 0 })
  likesCount: number;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  photoUrl: string;

  @ManyToMany(() => User, (user: User) => user.id)
  likes: User[];

  @ManyToOne(() => User, (user: User) => user.id)
  userId: User[];

  @Column({ nullable: false })
  clientId: number;

  @Column({ nullable: false })
  authorIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
