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
  @ApiOperation({ summary: 'List orders — filter by status or customer email' })
  @ApiOkResponse({ type: Order, isArray: true })
  findAll(@Query() filter: OrderFilterDto) {
    return this.ordersService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a full order with its line items' })
  @ApiOkResponse({ type: Order })
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Place a new order',
    description:
      'Validates stock, applies coupon discount, computes totals and persists the order atomically.',
  })
  @ApiCreatedResponse({ type: Order })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiOkResponse({ type: Order })
  updateStatus(@Param('id') id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}
