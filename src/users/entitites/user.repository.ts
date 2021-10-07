import { EntityRepository, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

import { User } from './user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, ip: string): Promise<User> {
    const { email, name, password, clientId } = createUserDto;
    const parsedEmail = email.trim().toLowerCase();
    const user = this.create();
    user.email = parsedEmail;
    user.name = name;
    user.ip = ip;
    user.clientId = clientId;
    user.password = password;

    await user.save();
    return user;
  }

  async findUserByEmail({ email }: CreateUserDto): Promise<User> {
    const parsedEmail = email.trim().toLowerCase();
    const user = await this.createQueryBuilder('user')
      .where('user.email = :parsedEmail', { parsedEmail })
      .addSelect('user.password')
      .getOne();
    return user;
  }
}
