import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateRandomCode } from './helpers/helper';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';

@Injectable()
export class UrlService {
  constructor(private readonly prismaService: PrismaService) {}

  private async generateShortUrl(): Promise<string> {
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = generateRandomCode(7);
      const existing: Url | null = await this.prismaService.url.findUnique({
        where: { shortCode: code },
      });
      if (!existing) isUnique = true;
    }

    return code;
  }

  async shortenUrl(createUrlDto: CreateUrlDto) {
    const { longUrl, customAlias } = createUrlDto;
    let shortCode: string;

    if (customAlias) {
      const existing = await this.prismaService.url.findUnique({
        where: { shortCode: customAlias },
      });
      if (existing) {
        throw new BadRequestException('This alias has been used!');
      }
      shortCode = customAlias;
    } else {
      shortCode = await this.generateShortUrl();
    }

    return this.prismaService.url.create({
      data: {
        longUrl,
        shortCode,
      },
    });
  }

  async getLongUrl(shortCode: string): Promise<string | null> {
    const urlRecord = await this.prismaService.url.findUnique({
      where: { shortCode },
    });
    if (!urlRecord) {
      throw new NotFoundException('URL not found or has been removed.');
    }
    return urlRecord.longUrl;
  }
}
