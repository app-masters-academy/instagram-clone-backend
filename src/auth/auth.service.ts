import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entitites/user.entity';
import { UserRepository } from 'src/users/entitites/user.repository';

import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser({ id }: JwtPayload) {
    const user: User =
      (await this.cacheManager.get(id)) ||
      (await this.userRepository.findOne(id));
    await this.cacheManager.set(user.id, user);
    return user;
  }

  async login(user: User) {
    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.name,
      ...token,
    };
  }

  private _createToken({ id }: UserDto) {
    const user: JwtPayload = { id };
    const accessToken = this.jwtService.sign(user, {
      privateKey: process.env.JWT_SECRETKEY,
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    return {
      expiresIn: process.env.JWT_EXPIRESIN,
      accessToken,
    };
  }
}
