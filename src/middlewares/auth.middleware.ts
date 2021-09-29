import {
  ForbiddenException,
  Inject,
  Injectable,
  CACHE_MANAGER,
  NestMiddleware,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { GoogleService } from 'src/services/googleSheet.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly googleSheet: GoogleService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const rawToken = req.headers['token'];
    if (!rawToken) {
      throw new ForbiddenException('token is required');
    }
    const token = rawToken.toString();
    const cachedUser = await this.cacheManager.get(token);
    if (!cachedUser) {
      const user = await this.googleSheet.querySheetByToken(token);
      if (!user) {
        throw new InternalServerErrorException('token does not exists');
      }
      req.user = user;
      next();
    } else {
      req.user = cachedUser;
      next();
    }
  }
}
