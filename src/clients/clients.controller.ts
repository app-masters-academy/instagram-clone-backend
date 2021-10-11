import {
  Body,
  Controller,
  Get,
  Post,
  Render,
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
  @Render('client/token')
  registerClient(@Body() createClientSheetDto: CreateClientDto) {
    return this.clientsService.getToken(createClientSheetDto);
  }

  @Get('/register')
  @Render('client/client-form')
  getForm() {
    return;
  }
}
