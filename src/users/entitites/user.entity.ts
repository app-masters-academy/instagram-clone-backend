import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsIP, Length } from 'class-validator';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  @Length(4, 30)
  name: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  @IsIP(4)
  ip: string;

  /*@OneToMany(() => Post, (post: Post) => post.id)
  posts: Post[];

  @ManyToMany(() => Post, (post: Post) => post.id)
  likes: Post[];*/

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
