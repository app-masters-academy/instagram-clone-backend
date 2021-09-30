import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './entitites/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  async login(createUserDto: CreateUserDto, ip: string) {
    const { email, password } = createUserDto;
    const parsedEmail = email.trim().toLowerCase();
    const userExists = await this.userRepository.findUserByEmail(parsedEmail);
    if (!userExists) {
      await this.userRepository.createUser(createUserDto, ip);
      return { auth: true };
    }
    const passEqual = await compare(password, userExists.password);
    if (!passEqual) {
      throw new BadRequestException('Wrong email or password');
    }
    return { auth: true };
  }
}
