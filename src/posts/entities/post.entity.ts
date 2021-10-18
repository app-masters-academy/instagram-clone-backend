import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { ILike } from '../interfaces/like.interface';

import { User } from 'src/users/entitites/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

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

  @Column({ type: 'json', nullable: true, default: { users: [] } })
  likes: ILike;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ nullable: false, default: 0 })
  commentsCount: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ nullable: false })
  clientId: string;

  @Column({ nullable: false })
  authorIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert() generateUUID() {
    this.id = randomUUID();
  }
}
