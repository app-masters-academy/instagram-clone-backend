import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { Cache } from 'cache-manager';

import { CreateClientDto } from './dto/create-client.dto';

import { GithubService } from '../services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

import { ClientRepository } from './entities/client.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gitHubService: GithubService,
    private readonly googleSheet: GoogleService,
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  async getToken(createClientDto: CreateClientDto) {
    const { email, github } = createClientDto;
    const parsedEmail = email.trim().toLowerCase();
    const clientDb: Client = await this.clientRepository.queryClientByEmail(
      parsedEmail,
    );
    if (clientDb) {
      const client = await this.googleSheet.querySheetByClientId(clientDb.id);
      if (client) {
        return { token: clientDb.token };
      } else {
        createClientDto.token = clientDb.token;
        createClientDto.id = clientDb.id;
        await this.googleSheet.addToSheet(createClientDto);
        return { token: clientDb.token };
      }
    }

    const githubExists = await this.gitHubService.verifyGithub(github);
    if (!githubExists) {
      return new BadRequestException("Provided GitHub profile don't exists");
    }

    createClientDto.email = parsedEmail;
    createClientDto.token = createHash('md5').update(parsedEmail).digest('hex');
    const addedClient = await this.clientRepository.createClient(
      createClientDto,
    );

    createClientDto.id = addedClient.id.toString();
    await this.googleSheet.addToSheet(createClientDto);

    return { token: addedClient.token };
  }
}
