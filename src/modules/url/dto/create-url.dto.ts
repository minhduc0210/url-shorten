import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Đây là url dài cần rút gọn',
    example: 'https://www.google.com',
  })
  @IsUrl({}, { message: 'Đây không phải là một url hợp lệ' })
  @IsNotEmpty({ message: 'Url không được để trống' })
  longUrl: string;

  @ApiProperty({
    description: 'Đây là url tùy chỉnh của bạn',
    example: 'my-custom-link',
  })
  @IsOptional()
  @IsString({ message: 'Url tùy chỉnh phải là một chuỗi' })
  @IsNotEmpty({ message: 'Url tùy chỉnh không được để trống' })
  @MaxLength(20, { message: 'Url tùy chỉnh không được vượt quá 20 ký tự' })
  customAlias?: string;
}
