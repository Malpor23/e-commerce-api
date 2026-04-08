import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@ApiSchema({ name: 'Crear Etiqueta' })
export class CreateTagDto {
  @ApiProperty({ example: 'inalámbrico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'inalambrico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;
}

@ApiSchema({ name: 'Actualizar Etiqueta' })
export class UpdateTagDto extends PartialType(CreateTagDto) {}
