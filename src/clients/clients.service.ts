import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { Cache } from 'cache-manager';

import { CreateClientSheetDto } from './dto/create-client-sheet.dto';

import { GithubService } from '../services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

import { GoogleSpreadsheetRow } from 'google-spreadsheet';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gitHubService: GithubService,
    private readonly googleSheet: GoogleService,
  ) {}

  async login(body: CreateClientSheetDto) {
    const { email, github } = body;
    const parsedEmail = email.trim().toLowerCase();
    const cachedUser: GoogleSpreadsheetRow = await this.cacheManager.get(
      parsedEmail,
    );
    if (cachedUser) {
      return { token: cachedUser.token };
    }
    const githubExists = await this.gitHubService.verifyGithub(github);
    if (!githubExists) {
      throw new Error("Provided GitHub profile don't exists");
    }
    const user: GoogleSpreadsheetRow = await this.googleSheet.querySheetByEmail(
      parsedEmail,
    );
    if (user) {
      return { token: user.token };
    }
    body.id = uuidv4();

    const addedClient = await this.googleSheet.addToSheet(body);

    return { token: addedClient.token };
  }
}
