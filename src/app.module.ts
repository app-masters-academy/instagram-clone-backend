import {
  CacheModule,
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/client.middleware';
import { GoogleService } from './services/googleSheet.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import * as ormconfig from './config/db';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.

  return TypeOrmModule.forRoot(ormconfig);
}

@Module({
  imports: [
    CacheModule.register({ max: 10000, ttl: 0 }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    ClientsModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [GoogleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'post', method: RequestMethod.ALL },
        { path: 'login', method: RequestMethod.ALL },
      );
  }
}
