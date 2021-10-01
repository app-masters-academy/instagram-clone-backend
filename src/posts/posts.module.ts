import { CacheModule, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './entities/post.repository';
import { GoogleService } from 'src/services/googleSheet.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/entitites/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ClientRepository } from 'src/clients/entities/client.repository';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      PostRepository,
      UserRepository,
      ClientRepository,
    ]),
    CacheModule.register({
      max: 10000,
      ttl: 0,
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [PostsController],
  providers: [PostsService, GoogleService],
})
export class PostsModule {}
