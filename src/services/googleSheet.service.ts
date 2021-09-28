import { Injectable } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';

@Injectable()
export class GoogleService {
  private sheetId: string;
  private sheetEmail: string;
  private privateKey: string;
  private doc: GoogleSpreadsheet;

  constructor() {
    this.sheetId = process.env.SHEET_ID;
    this.sheetEmail = process.env.SHEET_API_EMAIL;
    this.privateKey = process.env.SHEET_API_KEY;
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
}
