import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { GoogleService } from 'src/services/googleSheet.service';

import { UserRepository } from 'src/users/entitites/user.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './entities/post.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @Inject(REQUEST) private readonly req: Request,
    private googleService: GoogleService,
    private userRepository: UserRepository,
  ) {}
  async create(createPostDto: CreatePostDto) {
    console.log(this.req.user);
    const userToken: string = this.req.user.token;
    const client = await this.googleService.querySheetByToken(userToken);
    const ip = (await this.userRepository.findUserByEmail(client.token)).ip;
    const post = {
      description: createPostDto.description,
      photoUrl: 'photoUrl',
    };
    await this.postRepository.createPost(post, ip);
    return 'This action adds a new post';
  }

  async findAll() {
    if (this.req.headers['all-clients']) {
      const user = 0;
      await this.postRepository.findAll(user);
    } else {
      return await this.postRepository.findAll();
    }
  }
}
