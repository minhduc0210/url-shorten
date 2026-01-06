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
    description: 'This is the original url to be shortened',
    example: 'https://www.google.com',
  })
  @IsUrl({}, { message: 'Invalid url' })
  @IsNotEmpty({ message: 'Url is required' })
  longUrl: string;

  @ApiProperty({
    description: 'This is the custom alias for the shortened url',
    example: 'my-custom-link',
  })
  @IsOptional()
  @IsString({ message: 'Alias must be a string' })
  @MaxLength(20, { message: 'Alias must be max of 20 characters' })
  customAlias?: string;
}
