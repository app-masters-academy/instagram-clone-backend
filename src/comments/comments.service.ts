import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDto } from 'src/users/dto/user.dto';

import { CommentRepository } from './entities/comment.repository';
import { PostRepository } from 'src/posts/entities/post.repository';
import { PostDto } from 'src/posts/dto/post.dto';

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
    const post = <PostDto>await this.postRepository.findOne(postId, {
      relations: ['user', 'comments'],
    });
    if (!post) {
      throw new BadRequestException(`O Post requisitado não existe`);
    }
    post.commentsCount++;
    const comment = {
      ...createCommentDto,
      post: post,
      user: user,
      ip: ip,
    };
    const addedComment = await this.commentRepository.addComment(comment);
    delete post.comments;
    post.lastComment = addedComment;
    return post;
  }

  async deleteComment(id: string, user: UserDto) {
    const comment = await this.commentRepository.findOne(id, {
      relations: ['user', 'post'],
    });
    if (!comment) {
      throw new BadRequestException(
        `O comentário já foi deletado ou o id está errado`,
      );
    }

    if (comment.user.id !== user.id && comment.post.user.id !== user.id) {
      throw new ForbiddenException(
        `Não é possível deletar um comentário de outra pessoa ou se o post não é seu`,
      );
    }
    comment.post.commentsCount--;
    await comment.post.save();
    await comment.remove();
    const post = <PostDto>await this.postRepository.findOne(comment.post.id, {
      relations: ['comments'],
    });
    if (post.comments != []) {
      post.lastComment = post.comments.reduce((a, b) => {
        return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
      });
      delete post.comments;
    }
    return post;
  }
}
