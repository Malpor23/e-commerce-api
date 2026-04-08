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
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  OrderFilterDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pedidos — filtrar por estado o email del cliente' })
  @ApiOkResponse({ type: Order, isArray: true })
  findAll(@Query() filter: OrderFilterDto) {
    return this.ordersService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido completo con sus líneas de detalle' })
  @ApiOkResponse({ type: Order })
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Realizar un nuevo pedido',
    description:
      'Valida el stock, aplica el descuento del cupón, calcula los totales y persiste el pedido de forma atómica.',
  })
  @ApiCreatedResponse({ type: Order })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de un pedido' })
  @ApiOkResponse({ type: Order })
  updateStatus(@Param('id') id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}
