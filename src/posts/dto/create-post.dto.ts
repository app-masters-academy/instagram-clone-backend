import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class CreatePostDto {
  @IsNotEmpty({ message: 'O post precisa de uma descrição' })
  description: string;

  @IsOptional()
  @IsUrl()
  photoUrl: string;

  userId: UserDto;

  clientId: string;

  authorIp: string;
}
