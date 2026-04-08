import { ApiProperty, ApiPropertyOptional, ApiSchema, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiSchema({ name: 'Crear Reseña' })
export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: '¡Excelente producto!' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'La calidad de construcción es excepcional.' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  reviewerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  reviewerEmail: string;

  @ApiProperty({ example: 142 })
  productId: number;
}

@ApiSchema({ name: 'Actualizar Reseña' })
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

@ApiSchema({ name: 'Filtrar Reseñas' })
export class ReviewFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
