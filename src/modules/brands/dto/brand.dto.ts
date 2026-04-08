import { ApiProperty, ApiPropertyOptional, ApiSchema, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

@ApiSchema({ name: 'Crear Marca' })
export class CreateBrandDto {
  @ApiProperty({ example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'apple' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  slug: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logos/apple.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Piensa diferente.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Colombia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}

@ApiSchema({ name: 'Actualizar Marca' })
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
