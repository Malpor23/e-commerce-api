import { ApiProperty, ApiPropertyOptional, ApiSchema, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiSchema({ name: 'Imagen de Producto' })
export class CreateProductImageDto {
  @ApiProperty({ example: 'https://cdn.example.com/img.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Vista frontal' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

@ApiSchema({ name: 'Variante de Producto' })
export class CreateProductVariantDto {
  @ApiProperty({ example: 'Grande / rojo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'SKU-001-L-RED' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({ example: 49.99 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: { size: 'L', color: 'Rojo' } })
  @IsOptional()
  attributes?: Record<string, string>;
}

@ApiSchema({ name: 'Crear Producto' })
export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  slug: string;

  @ApiPropertyOptional({ example: 'El mejor iPhone hasta la fecha.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiProperty({ example: 'APPL-IP15P-128' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  brandId?: number;

  @ApiPropertyOptional({ type: [CreateProductImageDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({ type: [CreateProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({
    example: [2, 5],
    description: 'Array de ids de tags',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  tagIds?: number[];
}

@ApiSchema({ name: 'Actualizar Producto' })
export class UpdateProductDto extends PartialType(CreateProductDto) {}

@ApiSchema({ name: 'Filtrar Productos' })
export class ProductFilterDto extends PaginationDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  brandId?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
