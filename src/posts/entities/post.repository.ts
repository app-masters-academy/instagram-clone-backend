import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';

import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAll(clientId?: string) {
    if (!clientId) {
      const post = await this.find({ relations: ['user', 'comments'] });
      return post;
    }
    return await this.find({
      relations: ['user', 'comments'],
      where: { clientId: clientId },
    });
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = this.create({
      ...createPostDto,
    });
    await this.save(post);
    return post;
  }
}
