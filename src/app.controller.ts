import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {
      docUrl: 'https://documenter.getpostman.com/view/17473013/UUy38mGg',
      apiRepo: 'https://github.com/app-masters-academy/instagram-clone-backend',
    };
  }

  @Get('/docs')
  getDoc(@Res() res: Response) {
    const docUrl = 'https://documenter.getpostman.com/view/17473013/UUy38mGg';
    res.redirect(docUrl);
  }
}
