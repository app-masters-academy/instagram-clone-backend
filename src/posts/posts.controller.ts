import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RealIP } from 'nestjs-real-ip';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ClientDto } from 'src/clients/dto/client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png') {
          return cb(new Error('File must be an image'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: 'public/uploads/postImage/',
        filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @RealIP() ip: string,
  ) {
    const user = <UserDto>req.user;
    const client = <ClientDto>req.userClient;
    return this.postsService.createPost(createPostDto, user, client, ip, file);
  }

  @Get()
  findAll(@Req() req: any) {
    const client = <ClientDto>req.userClient;
    return this.postsService.findAll(client);
  }
}
