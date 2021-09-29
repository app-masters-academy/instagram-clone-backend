import { EntityRepository, Repository } from 'typeorm';
import { CreateClientDto } from '../dto/create-client.dto';

import { Client } from './client.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  async createClient(createClientDto: CreateClientDto) {
    const client = this.create();
    client.email = createClientDto.email;
    client.token = createClientDto.token;
    await this.save(client);
    return client;
  }
}
