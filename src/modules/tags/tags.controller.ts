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
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { Tag } from './entities/tag.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las etiquetas (paginado)' })
  @ApiOkResponse({ type: Tag, isArray: true })
  findAll(@Query() pagination: PaginationDto) {
    return this.tagsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una etiqueta por id' })
  @ApiOkResponse({ type: Tag })
  findOne(@Param('id') id: number) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una etiqueta' })
  @ApiCreatedResponse({ type: Tag })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una etiqueta' })
  @ApiOkResponse({ type: Tag })
  update(@Param('id') id: number, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una etiqueta' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.tagsService.remove(id);
  }
}
