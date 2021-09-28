import { Injectable } from '@nestjs/common';

import { CreateClientSheetDto } from './dto/create-client-sheet.dto';

import { GithubService } from '../services/github.service';
import { GoogleService } from 'src/services/googleSheet.service';

import { createHash } from 'crypto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly gitHubService: GithubService,
    private readonly googleSheet: GoogleService,
  ) {}

  private async queryClient(email: string) {
    const sheet = (await this.googleSheet.getDoc()).sheetsByIndex[0];

    const rows = await sheet.getRows();
    const user = rows.filter((row) => {
      return row.email === email;
    });
    return user;
  }

  async sheetRegister(body: CreateClientSheetDto) {
    const { email, github, name } = body;
    const parsedEmail = email.trim().toLowerCase();
    const githubExists = await this.gitHubService.verifyGithub(github);
    if (!githubExists) {
      throw new Error("Provided GitHub profile don't exists");
    }
    const user = await this.queryClient(parsedEmail);
    if (user.length == 0) {
      const sheet = (await this.googleSheet.getDoc()).sheetsByIndex[0];
      const token = createHash('md5').update(parsedEmail).digest('hex');
      const row = await sheet.addRow({
        email: parsedEmail,
        github: github.trim().toLowerCase(),
        name: name,
        token: token,
      });
      return { token: row.token };
    } else {
      return { token: user[0].token };
    }
  }
}
