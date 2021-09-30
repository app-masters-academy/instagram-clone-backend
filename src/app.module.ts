import {
  CacheModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { GoogleService } from './services/googleSheet.service';
import { PostsModule } from './posts/posts.module';
import { ClientRepository } from './clients/entities/client.repository';

@Global()
@Module({
  imports: [
    CacheModule.register({ max: 10000, ttl: 0 }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ClientsModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleService, ClientRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('post');
  }
}
