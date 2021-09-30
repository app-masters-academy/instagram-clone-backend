import { EntityRepository, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

import { User } from './user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, ip: string): Promise<User> {
    const { email, name, password } = createUserDto;
    const user = this.create();
    user.email = email;
    user.name = name;
    user.ip = ip;
    user.password = await hash(password, 10);

    await user.save();
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email: email });
    return user;
  }
}
