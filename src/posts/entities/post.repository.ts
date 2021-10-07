import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostDto } from '../dto/post.dto';

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
      const postsDto = <PostDto[]>posts;
      postsDto.forEach((post) => {
        if (post.comments.length) {
          post.lastComment = post.comments.reduce((a, b) => {
            return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
          });
          delete post.comments;
        }
      });
      return postsDto;
    }
    const posts = await this.find({
      relations: ['user', 'comments'],
      where: { clientId: clientId },
    });
    posts.forEach(async (post) => {
      post.commentsCount = post.comments.length;
      await post.save();
    });
    const postsDto = <PostDto[]>posts;
    postsDto.forEach((post) => {
      if (post.comments.length) {
        post.lastComment = post.comments.reduce((a, b) => {
          return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
        });
        delete post.comments;
      }
    });
    return postsDto;
  }

  async createPost(createPostDto: CreatePostDto) {
    const post = this.create({
      ...createPostDto,
    });
    await this.save(post);
    return post;
  }
}
