import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@UsePipes(new ValidationPipe())
@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Post('/')
  registerClient(@Body() createClientSheetDto: CreateClientDto) {
    return this.clientsService.getToken(createClientSheetDto);
  }
}
