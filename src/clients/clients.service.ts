import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

import { Cache } from 'cache-manager';

import { CreateClientDto } from './dto/create-client.dto';

import { GithubService } from '../services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { ClientRepository } from './entities/client.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gitHubService: GithubService,
    private readonly googleSheet: GoogleService,
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  async login(createClientDto: CreateClientDto) {
    const { email, github } = createClientDto;
    const parsedEmail = email.trim().toLowerCase();
    const cachedUser: GoogleSpreadsheetRow = await this.cacheManager.get(
      parsedEmail,
    );
    if (cachedUser) {
      return { token: cachedUser.token };
    }
    const user: GoogleSpreadsheetRow = await this.googleSheet.querySheetByEmail(
      parsedEmail,
    );
    if (user) {
      return { token: user.token };
    }

    const githubExists = await this.gitHubService.verifyGithub(github);
    if (!githubExists) {
      throw new Error("Provided GitHub profile don't exists");
    }

    createClientDto.email = parsedEmail;
    createClientDto.token = createHash('md5').update(parsedEmail).digest('hex');
    const dbUser = await this.clientRepository.createClient(createClientDto);
    createClientDto.id = dbUser.id.toString();
    console.log(createClientDto);
    const addedClient = await this.googleSheet.addToSheet(createClientDto);

    return { token: addedClient.token };
  }
}
