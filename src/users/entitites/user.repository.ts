import { EntityRepository, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

import { User } from './user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, ip: string): Promise<User> {
    const { email, name, password } = createUserDto;
    console.log(password);
    const user = this.create();
    user.email = email;
    user.name = name;
    user.ip = ip;

    try {
      user.password = await hash(password, 10);
      await user.save();
      user.password;
      user.ip;
      return user;
    } catch (err) {
      throw new InternalServerErrorException('Error creating User');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.findOne({ email: email });
    return user;
  }
}
