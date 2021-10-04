import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getDoc(@Res() res: Response) {
    const docUrl = 'https://documenter.getpostman.com/view/17473013/UUy38mGg';
    res.redirect(docUrl);
  }
}
