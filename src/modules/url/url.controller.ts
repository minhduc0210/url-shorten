import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import express from 'express';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class UrlAdminController {
  constructor(private readonly urlService: UrlService) {}

  @Get('')
  async getAll() {
    return this.urlService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: { longUrl: string; shortCode?: string },
  ) {
    return this.urlService.update(
      +id,
      updateData.longUrl,
      updateData.shortCode,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.urlService.remove(+id);
  }
}

@Controller('')
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
