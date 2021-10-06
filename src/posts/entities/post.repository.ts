import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';

import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAll(clientId?: string) {
    if (!clientId) {
      const posts = await this.find({ relations: ['user', 'comments'] });
      posts.forEach(async (post) => {
        post.commentsCount = post.comments.length;
        await post.save();
      });
      return posts;
    }
    const posts = await this.find({
      relations: ['user', 'comments'],
      where: { clientId: clientId },
    });
    posts.forEach(async (post) => {
      post.commentsCount = post.comments.length;
      await post.save();
    });
    return posts;
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = this.create({
      ...createPostDto,
    });
    await this.save(post);
    return post;
  }
}
