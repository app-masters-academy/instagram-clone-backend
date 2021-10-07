import { PostDto } from 'src/posts/dto/post.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class CreateCommentDto {
  text: string;

  post: PostDto;

  user: UserDto;

  ip: string;
}
