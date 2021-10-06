import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDto } from 'src/users/dto/user.dto';

import { CommentRepository } from './entities/comment.repository';
import { PostRepository } from 'src/posts/entities/post.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
  ) {}

  async commentOnPost(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: UserDto,
    ip: string,
  ) {
    const post = await this.postRepository.findOne(postId);
    if (!post) throw new BadRequestException(`Post doens't exists`);
    const comment = {
      ...createCommentDto,
      post: post,
      user: user,
      ip: ip,
    };
    const addedComment = await this.commentRepository.addComment(comment);
    return addedComment;
  }
}
