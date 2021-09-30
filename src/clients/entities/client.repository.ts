import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Cache } from 'cache-manager';

import { CreateClientDto } from '../dto/create-client.dto';

import { Client } from './client.entity';

@Injectable()
@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  async createClient(createClientDto: CreateClientDto) {
    const client = this.create();
    client.email = createClientDto.email;
    client.token = createClientDto.token;
    await this.save(client);
    return client;
  }

  async queryClientByToken(token: string) {
    const client = await this.findOne({ token: token });
    return client;
  }

  async queryClientByEmail(email: string) {
    const client = await this.findOne({ email: email });
    return client;
  }
}
