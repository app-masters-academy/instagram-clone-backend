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

  @Post('/:postid')
  @UseGuards(AuthGuard())
  commentOnPost(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postid') postid: string,
    @Req() req: any,
    @RealIP() ip: string,
  ) {
    const user = <UserDto>req.user;
    return this.commentsService.commentOnPost(
      createCommentDto,
      postid,
      user,
      ip,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteComment(@Param('id') id: string, @Req() req: any) {
    const user = <UserDto>req.user;
    return this.commentsService.deleteComment(id, user);
  }
}
