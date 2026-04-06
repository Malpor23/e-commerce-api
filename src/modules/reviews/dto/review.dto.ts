import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Excellent product!' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'The build quality is outstanding.' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ example: 'John Doe' })
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

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

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
