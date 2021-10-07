import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RealIP } from 'nestjs-real-ip';
import { UserDto } from 'src/users/dto/user.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

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
