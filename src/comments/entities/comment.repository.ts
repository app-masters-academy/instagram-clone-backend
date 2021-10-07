import { EntityRepository, Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';

import { Comment } from './comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async addComment(createCommentDto: CreateCommentDto) {
    const comment = await this.create({
      ...createCommentDto,
    }).save();
    delete comment.post;
    return comment;
  }
}
