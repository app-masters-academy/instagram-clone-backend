import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { ClientDto } from 'src/clients/dto/client.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './entities/post.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @Inject(REQUEST) private readonly req: Request,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    user: UserDto,
    client: ClientDto,
    ip: string,
  ) {
    createPostDto.photoUrl = 'sample';
    const post = {
      ...createPostDto,
      clientId: client.id,
      user: user,
      authorIp: ip,
    };
    const addedPost = await this.postRepository.createPost(post);
    delete addedPost.user.password;
    return addedPost;
  }

  async findAll(clientDto: ClientDto) {
    if (this.req.headers['all-clients'] === 'false') {
      const posts = await this.postRepository.findAll(clientDto.id);
      return posts;
    } else {
      return await this.postRepository.findAll();
    }
  }

  async deletePost(postId: string, user: UserDto) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['user'],
    });
    if (!post) {
      throw new BadRequestException(
        `This post id doesn't exists or post is already excluded`,
      );
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Cannot remove post from another user');
    }
    await post.remove();
    return { post: postId, deleted: true };
  }
}
