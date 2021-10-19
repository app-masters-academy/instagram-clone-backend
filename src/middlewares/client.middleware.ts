import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  NestMiddleware,
  BadRequestException,
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
    const rawToken = req.headers['client-token'];
    if (!rawToken) {
      throw new BadRequestException('O header client-token é necessário');
    }
    const token = rawToken.toString();

    const client: Client =
      (await this.cacheManager.get(token)) ||
      (await this.clientRepository.queryClientByToken(token));
    if (!client) {
      throw new BadRequestException(
        'O header client-token está errado, client não encontrado',
      );
    }
    await this.cacheManager.set(client.token, client);
    req.userClient = client;

    next();
  }
}
