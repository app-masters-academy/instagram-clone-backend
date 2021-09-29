import { CacheModule, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { GithubService } from 'src/services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

@Module({
  imports: [
    CacheModule.register({
      max: 10000,
      ttl: 0,
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, GithubService, GoogleService],
})
export class ClientsModule {}
