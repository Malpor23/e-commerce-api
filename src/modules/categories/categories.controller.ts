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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías (paginado)' })
  @ApiOkResponse({ type: Category, isArray: true })
  findAll(@Query() pagination: PaginationDto) {
    return this.categoriesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una categoría por id (incluye padre e hijos)',
  })
  @ApiOkResponse({ type: Category })
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiCreatedResponse({ type: Category })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiOkResponse({ type: Category })
  update(@Param('id') id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
