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
import { ClientRepository } from 'src/clients/entities/client.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const rawToken = req.headers['token'];
    if (!rawToken) {
      throw new ForbiddenException('token is required');
    }
    const token = rawToken.toString();
    const cachedUser = await this.cacheManager.get(token);
    if (!cachedUser) {
      const user = await this.clientRepository.queryClientByToken(token);
      if (!user) {
        throw new InternalServerErrorException('token does not exists');
      }
      await this.cacheManager.set(user.token, user);
      req.user = user;
      next();
    } else {
      req.user = cachedUser;
      next();
    }
  }
}
