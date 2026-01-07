import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateRandomCode } from './helpers/helper';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from 'generated/prisma/client';

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
        throw new BadRequestException('Url tùy chỉnh đã được sử dụng');
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
      return null;
    }
    return urlRecord.longUrl;
  }

  async findAll(): Promise<Url[]> {
    try {
      return await this.prismaService.url.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Không thể truy xuất dữ liệu!');
    }
  }

  async update(id: number, longUrl: string, shortCode?: string): Promise<Url> {
    const existingUrl = await this.prismaService.url.findUnique({
      where: { id },
    });
    if (!existingUrl) {
      throw new NotFoundException(`Không tìm thấy bản ghi với ID ${id}`);
    }
    if (shortCode && shortCode !== existingUrl.shortCode) {
      const duplicateCode = await this.prismaService.url.findUnique({
        where: { shortCode },
      });
      if (duplicateCode) {
        throw new ConflictException(
          'Mã rút gọn này đã tồn tại, vui lòng chọn mã khác!',
        );
      }
    }
    try {
      return await this.prismaService.url.update({
        where: { id },
        data: {
          longUrl,
          shortCode: shortCode || existingUrl.shortCode,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Cập nhật thất bại, vui lòng thử lại!',
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingUrl = await this.prismaService.url.findUnique({
      where: { id },
    });

    if (!existingUrl) {
      throw new NotFoundException(
        `Bản ghi với ID ${id} không tồn tại hoặc đã bị xóa trước đó.`,
      );
    }
    try {
      await this.prismaService.url.delete({
        where: { id },
      });
      return { message: `Xóa thành công link: ${existingUrl.shortCode}` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống khi xóa dữ liệu!');
    }
  }
}
