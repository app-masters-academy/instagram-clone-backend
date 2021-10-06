import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PostRepository } from 'src/posts/entities/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/entitites/user.repository';
import { CommentRepository } from './entities/comment.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PostRepository,
      UserRepository,
      CommentRepository,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [TypeOrmModule],
})
export class CommentsModule {}
