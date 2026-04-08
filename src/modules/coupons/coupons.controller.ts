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
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los cupones (paginado)' })
  @ApiOkResponse({ type: Coupon, isArray: true })
  findAll(@Query() pagination: PaginationDto) {
    return this.couponsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cupón por id' })
  @ApiOkResponse({ type: Coupon })
  findOne(@Param('id') id: number) {
    return this.couponsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Buscar un cupón por su código' })
  @ApiOkResponse({ type: Coupon })
  findByCode(@Param('code') code: string) {
    return this.couponsService.findByCode(code);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un cupón' })
  @ApiCreatedResponse({ type: Coupon })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cupón' })
  @ApiOkResponse({ type: Coupon })
  update(@Param('id') id: number, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cupón' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.couponsService.remove(id);
  }
}
