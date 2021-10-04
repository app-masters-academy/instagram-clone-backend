import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = 'https://api.github.com';
  }
  async verifyGithub(nickname: string) {
    try {
      const parsedNick = nickname.trim().toLowerCase();
      const { status } = await axios.get(`${this.baseUrl}/users/${parsedNick}`);
      if (status === 200) {
        return true;
      } else {
        throw new Error();
      }
    } catch {
      return false;
    }
  }
}
