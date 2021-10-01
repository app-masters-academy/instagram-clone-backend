import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RealIP } from 'nestjs-real-ip';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ClientDto } from 'src/clients/dto/client.dto';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @RealIP() ip: string,
  ) {
    const user = <UserDto>req.user;
    const client = <ClientDto>req.userClient;
    return this.postsService.createPost(createPostDto, user, client, ip);
  }

  @Get()
  findAll(@Req() req: any) {
    const client = <ClientDto>req.userClient;
    return this.postsService.findAll(client);
  }
}