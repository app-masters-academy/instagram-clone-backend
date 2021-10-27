import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';
import { CommentsService } from './comments.service';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteComment(@Param('id') id: string, @Req() req: any) {
    const user = <UserDto>req.user;
    return this.commentsService.deleteComment(id, user);
  }
}
