import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';

import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAll(clientId?: string) {
    if (!clientId) {
      return (await this.find({ relations: ['user'] })).map((post) => {
        if (post.user) {
          delete post.user.password;
          return post;
        }
      });
    }
    return (
      await this.find({
        relations: ['user'],
        where: { clientId: clientId },
      })
    ).map((post) => {
      if (post.user) {
        delete post.user.password;
        return post;
      }
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
