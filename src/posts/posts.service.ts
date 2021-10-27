import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { ClientDto } from 'src/clients/dto/client.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDto } from 'src/users/dto/user.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './entities/post.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostsService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: UserDto,
    client: ClientDto,
    file: Express.Multer.File,
    ip: string,
  ) {
    if (!createPostDto.photoUrl) {
      if (!file) {
        throw new BadRequestException(
          `Forneça um link no campo "photoUrl" (form url encoded) ou um arquivo no campo "file" (multipart)`,
        );
      }
      const uploaded = await this.cloudinaryService.uploadImage(file);
      createPostDto.photoUrl = uploaded.url;
    }
    const post = {
      ...createPostDto,
      clientId: client.id,
      user: user,
      authorIp: ip,
    };
    const addedPost = await this.postRepository.createPost(post);
    return addedPost;
  }

  async likePost(postId: string, user: UserDto) {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new BadRequestException(
        'Post não encontrado, tente com outro post id',
      );
    }
    if (post.likes == null) {
      post.likes = { users: [] };
      await post.save();
    }
    if (post.likes.users.includes(user.id)) {
      post.likes.users = post.likes.users.filter((arrUser) => {
        return arrUser != user.id;
      });
      post.likesCount--;
      await post.save();
      return post;
    }
    post.likes.users.push(user.id);
    post.likesCount++;
    await post.save();
    return post;
  }

  async findAll(clientDto: ClientDto) {
    if (this.req.headers['all-clients'] === 'false') {
      return await this.postRepository.findAll(clientDto.id);
    } else {
      return await this.postRepository.findAll();
    }
  }

  async findOne(postId: string) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['user', 'comments'],
    });
    if (!post) {
      throw new BadRequestException(
        'O post não existe ou o id fornecido está incorreto',
      );
    }
    return post;
  }

  async deletePost(postId: string, user: UserDto) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['user'],
    });
    if (!post) {
      throw new BadRequestException(`O post não existe ou já foi excluído`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException(
        'Não é possível remover o post de outro usuário',
      );
    }
    await post.remove();
    return { post: post, deleted: true };
  }
}
