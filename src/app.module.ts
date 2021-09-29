import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register({ max: 10000, ttl: 0 }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ClientsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
