import {
  Body,
  Req,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { ClientDto } from 'src/clients/dto/client.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@UsePipes(new ValidationPipe())
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  login(
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
    @RealIP() ip: string,
  ) {
    const client = <ClientDto>req.userClient;
    return this.usersService.login(createUserDto, client, ip);
  }
}
