import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Post } from 'src/posts/entities/post.entity';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  id: string;

  @Column({ nullable: false })
  @Length(4, 30)
  name: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  ip: string;

  @Column()
  clientId: string;

  @OneToMany(() => Post, (post: Post) => post.id)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert() async hashPassword() {
    this.password = await hash(this.password, 10);
  }
  @BeforeInsert() generateUUID() {
    this.id = randomUUID();
  }
}
