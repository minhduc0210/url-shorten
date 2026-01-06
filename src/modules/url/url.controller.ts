import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import express from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.shortenUrl(createUrlDto);
  }

  @Get(':code')
  async getLongUrl(@Param('code') code: string, @Res() res: express.Response) {
    const longUrl = await this.urlService.getLongUrl(code);
    if (longUrl) {
      res.redirect(HttpStatus.MOVED_PERMANENTLY, longUrl);
    }
  }
}
