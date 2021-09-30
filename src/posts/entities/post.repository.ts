import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';

import { Post } from './post.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAll(clientId?: number) {
    if (!clientId) {
      return await this.find();
    }
    return await this.find({ clientId: clientId });
  }

  async createPost(body, ip: string) {
    const post = this.create();
    post.description = body.description;
    post.photoUrl = body.photoUrl;
    post.authorIp = ip;
    return test;
  }
}
