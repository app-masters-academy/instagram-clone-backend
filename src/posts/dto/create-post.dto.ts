import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Provide a description' })
  description: string;

  photoUrl: string;

  userId: UserDto;

  clientId: string;

  authorIp: string;
}
