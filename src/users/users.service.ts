import {
  BadRequestException,
  Inject,
  Injectable,
  CACHE_MANAGER,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';

import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './entitites/user.repository';
import { User } from './entitites/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { ClientDto } from 'src/clients/dto/client.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private authService: AuthService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  async login(createUserDto: CreateUserDto, { id }: ClientDto, ip: string) {
    const { email, password } = createUserDto;
    const parsedEmail = email.trim().toLowerCase();
    const userExists: User =
      (await this.cacheManager.get(parsedEmail)) ||
      (await this.userRepository.findUserByEmail(createUserDto));

    if (!userExists) {
      createUserDto.clientId = id;
      const user = await this.userRepository.createUser(createUserDto, ip);

      await this.cacheManager.set(user.email, user);
      return await this.authService.login(user);
    }
    await this.cacheManager.set(userExists.email, userExists);
    const passEqual = await compare(password, userExists.password);
    if (!passEqual) {
      throw new BadRequestException('Senha ou email incorretos');
    }
    return await this.authService.login(userExists);
  }

  async findByPayload(payload: JwtPayload) {
    return await this.userRepository.findOne(payload.id);
  }
}
