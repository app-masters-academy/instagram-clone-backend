import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDoc(@Res() res: Response) {
    const docUrl = 'https://documenter.getpostman.com/view/17473013/UUy38mGg';
    res.redirect(docUrl);
  }
}
