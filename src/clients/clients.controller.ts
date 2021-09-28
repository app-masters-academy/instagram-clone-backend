import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientSheetDto } from './dto/create-client-sheet.dto';

UsePipes(new ValidationPipe());
@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Post('/')
  registerClient(@Body() createClientSheetDto: CreateClientSheetDto) {
    return this.clientsService.sheetRegister(createClientSheetDto);
  }
}
