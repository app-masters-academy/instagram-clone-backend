import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entitites/user.entity';
import { randomUUID } from 'crypto';
import { ILike } from '../interfaces/like.interface';

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  id: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  photoUrl: string;

  @Column({ nullable: false, default: 0 })
  likesCount: number;

  @Column({ type: 'json', nullable: true })
  likes: ILike;

  @ManyToOne(() => User, (user: User) => user.id)
  user: User;

  @Column({ nullable: false })
  clientId: string;

  @Column({ nullable: false })
  authorIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert() generateUUID() {
    this.id = randomUUID();
  }
}
