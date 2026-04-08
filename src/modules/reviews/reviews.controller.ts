import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  ReviewFilterDto,
  UpdateReviewDto,
} from './dto/review.dto';
import { Review } from './entities/review.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reseñas — filtrar por producto o puntuación' })
  @ApiOkResponse({ type: Review, isArray: true })
  findAll(@Query() filter: ReviewFilterDto) {
    return this.reviewsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reseña por id' })
  @ApiOkResponse({ type: Review })
  findOne(@Param('id') id: number) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una reseña para un producto' })
  @ApiCreatedResponse({ type: Review })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reseña' })
  @ApiOkResponse({ type: Review })
  update(@Param('id') id: number, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una reseña' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.reviewsService.remove(id);
  }
}
