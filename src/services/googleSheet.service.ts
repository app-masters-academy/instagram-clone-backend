import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { Cache } from 'cache-manager';

import { CreateClientDto } from 'src/clients/dto/create-client.dto';

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
    if (!this.doc) {
      throw new InternalServerErrorException('Cannot load doc:' + this.doc);
    }
    return this.doc;
  }

  async querySheetByEmail(email: string): Promise<GoogleSpreadsheetRow> {
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    if (!sheet) {
      throw new InternalServerErrorException('Cannot load sheet:' + sheet);
    }
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

  async querySheetByClientId(id: string): Promise<GoogleSpreadsheetRow> {
    const cachedRow: GoogleSpreadsheetRow = await this.cacheManager.get(id);
    if (cachedRow) {
      return cachedRow;
    }
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    const rows = await sheet.getRows();
    rows.forEach(async (row) => {
      await this.cacheManager.set(row.Id, row);
    });
    const user = rows.filter((row) => {
      return row.Id === id;
    });
    return user[0];
  }

  async addToSheet(user: CreateClientDto): Promise<GoogleSpreadsheetRow> {
    const { id, email, github, token, name } = user;
    const parsedEmail = email.trim().toLowerCase();
    const sheet = (await this.getDoc()).sheetsByIndex[0];
    if (!sheet) {
      throw new InternalServerErrorException('Cannot load sheet:' + sheet);
    }
    const columnValues = sheet.headerValues;
    if (columnValues) {
      if (
        !columnValues.includes('Id') ||
        !columnValues.includes('Email') ||
        !columnValues.includes('GitHub') ||
        !columnValues.includes('Nome') ||
        !columnValues.includes('Token')
      ) {
        throw new InternalServerErrorException(
          `The spreadsheet don't have one of this properties: Id, Email, GitHub, Nome, Token`,
        );
      }
    }

    const row = await sheet.addRow({
      Id: id,
      Email: parsedEmail,
      GitHub: github,
      Nome: name,
      Token: token,
    });
    await this.cacheManager.set(row.Id, row);
    return row;
  }
}
