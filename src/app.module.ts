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
import { Client } from './clients/entities/client.entity';
import { User } from './users/entitites/user.entity';
import { Post } from './posts/entities/post.entity';

@Module({
  imports: [
    CacheModule.register({ max: 10000, ttl: 0 }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Client, User, Post],
      synchronize: false,
    }),
    ClientsModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('post');
  }
}
