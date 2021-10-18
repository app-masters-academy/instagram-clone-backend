import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from 'src/users/entitites/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  id: string;

  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: false,
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ nullable: false })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateUUID() {
    this.id = randomUUID();
  }
}
