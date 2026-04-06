import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Smartphones' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'smartphones' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  slug: string;

  @ApiPropertyOptional({ example: 'Latest smartphones and accessories' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  parentId?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
