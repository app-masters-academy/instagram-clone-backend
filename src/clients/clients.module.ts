import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { GithubService } from 'src/services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, GithubService, GoogleService],
})
export class ClientsModule {}
