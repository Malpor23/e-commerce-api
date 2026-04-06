import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class ShippingAddressDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fullName: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  country: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({ example: '+1 555-1234' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

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

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe' })
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

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: constants.ORDER_STATUS,
    example: constants.ORDER_STATUS.PAID,
  })
  @IsEnum(constants.ORDER_STATUS)
  status: constants.OrderStatus;
}

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
