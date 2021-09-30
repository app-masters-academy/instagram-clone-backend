import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './entitites/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    CacheModule.register({
      max: 10000,
      ttl: 0,
    }),
    UsersModule,
  ],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
