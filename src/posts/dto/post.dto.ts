import { User } from 'src/users/entitites/user.entity';

export class PostDto {
  id: string;

  description: string;

  photoUrl: string;

  likesCount: number;

  userId: User;

  clientId: string;

  authorIp: string;
}
