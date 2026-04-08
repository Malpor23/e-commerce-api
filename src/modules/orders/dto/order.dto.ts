import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import * as constants from '@common/constants';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiSchema({ name: 'Dirección de Envío' })
export class ShippingAddressDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fullName: string;

  @ApiProperty({ example: 'Calle 123 # 45-67' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Cundinamarca' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: 'CO' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  country: string;

  @ApiProperty({ example: '110111' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

@ApiSchema({ name: 'Crear items del Pedido' })
export class CreateOrderItemDto {
  @ApiProperty({ example: 54 })
  productId: number;

  @ApiPropertyOptional({ example: 21 })
  @IsOptional()
  variantId?: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

@ApiSchema({ name: 'Crear Pedido' })
export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ type: [CreateOrderItemDto], minItems: 1 })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ example: 'SAVE20' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  couponCode?: string;
}

@ApiSchema({ name: 'Actualizar Estado de Pedido' })
export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: constants.ORDER_STATUS,
    example: constants.ORDER_STATUS.PAID,
  })
  @IsEnum(constants.ORDER_STATUS)
  status: constants.OrderStatus;
}

@ApiSchema({ name: 'Filtrar Pedidos' })
export class OrderFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: constants.ORDER_STATUS })
  @IsOptional()
  @IsEnum(constants.ORDER_STATUS)
  status?: constants.OrderStatus;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}
