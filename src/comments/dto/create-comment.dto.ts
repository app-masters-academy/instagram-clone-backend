import { IsNotEmpty } from 'class-validator';
import { PostDto } from 'src/posts/dto/post.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'The comment need a text' })
  text: string;

  post: PostDto;

  user: UserDto;

  ip: string;
}
