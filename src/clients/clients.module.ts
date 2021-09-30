import { CacheModule, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { GithubService } from 'src/services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';
import { ClientRepository } from './entities/client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientRepository]),
    CacheModule.register({
      max: 10000,
      ttl: 0,
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, GithubService, GoogleService, ClientRepository],
})
export class ClientsModule {}
