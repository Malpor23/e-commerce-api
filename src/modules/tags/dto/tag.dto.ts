import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'wireless' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'wireless' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
