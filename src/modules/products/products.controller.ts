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
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductFilterDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar productos con filtros y paginación',
    description:
      'Filtra por categoría, marca, rango de precio, estado y término de búsqueda.',
  })
  @ApiOkResponse({ type: Product, isArray: true })
  findAll(@Query() filter: ProductFilterDto) {
    return this.productsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id (incluye todas las relaciones)' })
  @ApiOkResponse({ type: Product })
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un producto (con imágenes, variantes y etiquetas)',
  })
  @ApiCreatedResponse({ type: Product })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiOkResponse({ type: Product })
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
