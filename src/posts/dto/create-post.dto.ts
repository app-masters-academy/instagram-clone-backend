import { UserDto } from 'src/users/dto/user.dto';

export class CreatePostDto {
  description: string;

  photoUrl: string;

  userId: UserDto;

  clientId: string;

  authorIp: string;
}
