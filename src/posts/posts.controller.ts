import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { RealIP } from 'nestjs-real-ip';

import { PostsService } from './posts.service';
import { CommentsService } from 'src/comments/comments.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ClientDto } from 'src/clients/dto/client.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@Controller('post')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png') {
          cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @RealIP() ip: string,
  ) {
    const user = <UserDto>req.user;
    const client = <ClientDto>req.userClient;
    return this.postsService.createPost(createPostDto, user, client, file, ip);
  }

  @Post('/:id/like')
  @UseGuards(AuthGuard())
  like(@Param('id') id: string, @Req() req: any) {
    const user = <UserDto>req.user;
    return this.postsService.likePost(id, user);
  }

  @UsePipes(new ValidationPipe())
  @Post('/:postid/comment')
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

  @Get()
  findAll(@Req() req: any) {
    const client = <ClientDto>req.userClient;
    return this.postsService.findAll(client);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deletePost(@Param('id') id: string, @Req() req: any) {
    const user = <UserDto>req.user;
    return this.postsService.deletePost(id, user);
  }
}
