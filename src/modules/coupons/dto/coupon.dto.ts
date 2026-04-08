import { ApiProperty, ApiPropertyOptional, ApiSchema, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import * as constants from '@common/constants';

@ApiSchema({ name: 'Crear Cupón' })
export class CreateCouponDto {
  @ApiProperty({ example: 'SAVE20' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  code: string;

  @ApiProperty({
    enum: constants.DISCOUNT_TYPE,
    example: constants.DISCOUNT_TYPE.PERCENTAGE,
  })
  @IsEnum(constants.DISCOUNT_TYPE)
  discountType: constants.DiscountType;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsPositive()
  discountValue: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxUses?: number;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

@ApiSchema({ name: 'Actualizar Cupón' })
export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
