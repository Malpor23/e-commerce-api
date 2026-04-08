import { ApiProperty, ApiPropertyOptional, ApiSchema, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@ApiSchema({ name: 'Crear Categoría' })
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

  @ApiPropertyOptional({ example: 'Últimos smartphones y accesorios' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  parentId?: number;
}

@ApiSchema({ name: 'Actualizar Categoría' })
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
