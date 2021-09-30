import {
  ForbiddenException,
  Inject,
  Injectable,
  CACHE_MANAGER,
  NestMiddleware,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { Client } from 'src/clients/entities/client.entity';
import { ClientRepository } from 'src/clients/entities/client.repository';
import { UserRepository } from 'src/users/entitites/user.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const rawToken = req.headers['token'];
    if (!rawToken) {
      throw new ForbiddenException('token is required');
    }
    const token = rawToken.toString();

    const client: Client =
      (await this.cacheManager.get(token)) ||
      (await this.clientRepository.queryClientByToken(token));
    if (!client) {
      throw new InternalServerErrorException('token does not exists');
    }
    await this.cacheManager.set(client.token, client);
    req.user = client;
    next();
  }
}
