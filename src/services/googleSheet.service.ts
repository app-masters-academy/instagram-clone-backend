import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';

import { CreateClientSheetDto } from 'src/clients/dto/create-client-sheet.dto';

@Injectable()
export class GoogleService {
  private sheetId: string;
  private sheetEmail: string;
  private privateKey: string;
  private doc: GoogleSpreadsheet;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.sheetId = process.env.SHEET_ID;
    this.sheetEmail = process.env.SHEET_API_EMAIL;
    this.privateKey = process.env.SHEET_API_PRIVATE_KEY;
    this.doc = new GoogleSpreadsheet(this.sheetId);
    this.doc.useServiceAccountAuth({
      client_email: this.sheetEmail,
      private_key: this.privateKey.replace(/\\n/g, '\n'),
    });
  }

  async getDoc() {
    await this.doc.loadInfo();
    return this.doc;
  }

  async querySheetByEmail(email: string): Promise<GoogleSpreadsheetRow> {
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    const parsedEmail = email.trim().toLowerCase();
    const rows = await sheet.getRows();
    rows.forEach(async (row) => {
      await this.cacheManager.set(row.email, row);
    });
    const user = rows.filter((row) => {
      return row.email === parsedEmail;
    });
    return user[0];
  }

  async querySheetByToken(token: string): Promise<GoogleSpreadsheetRow> {
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    const rows = await sheet.getRows();
    rows.forEach(async (row) => {
      await this.cacheManager.set(row.token, row);
    });
    const user = rows.filter((row) => {
      return row.token === token;
    });
    console.log(user[0].token);
    return user[0];
  }

  async addToSheet(user: CreateClientSheetDto): Promise<GoogleSpreadsheetRow> {
    const { email, github, name } = user;
    const parsedEmail = email.trim().toLowerCase();
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    const token = createHash('md5').update(parsedEmail).digest('hex');
    const row = await sheet.addRow({
      email: parsedEmail,
      github: github.trim().toLowerCase(),
      name: name.toLowerCase(),
      token: token,
    });
    await this.cacheManager.set(row.email, row);
    return row;
  }
}
