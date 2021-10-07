import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entitites/user.entity';
import { ILike } from '../interfaces/like.interface';

export class PostDto {
  id: string;

  description: string;

  photoUrl: string;

  likesCount?: number;

  lastComment?: Comment;

  comments: Comment[];

  commentsCount?: number;

  likes: ILike;

  user: User;

  clientId: string;

  authorIp: string;
}
