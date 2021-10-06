import { User } from 'src/users/entitites/user.entity';

export class PostDto {
  id: string;

  description: string;

  photoUrl: string;

  likesCount: number;

  user: User;

  clientId: string;

  authorIp: string;
}
