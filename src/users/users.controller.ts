import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@UsePipes(new ValidationPipe())
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  login(@Body() createUserDto: CreateUserDto, @RealIP() ip: string) {
    return this.usersService.login(createUserDto, ip);
  }
}
