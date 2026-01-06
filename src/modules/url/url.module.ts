import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlAdminController, UrlController } from './url.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrlAdminController, UrlController],
  providers: [UrlService],
})
export class UrlModule {}
