import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import type { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ORDER_STATUS } from '@common/constants';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@common/dto/api-response.dto';
import type { Order } from './entities/order.entity';

const mockOrder = (): Order =>
  ({ id: 1, customerName: 'John', status: ORDER_STATUS.PENDING }) as Order;

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('findAll — delega a OrdersService.findAll', async () => {
    const paginated = new PaginatedResponseDto([mockOrder()], new PaginationMetaDto(1, 10, 1));
    service.findAll.mockResolvedValue(paginated);

    const filter = Object.assign(new PaginationDto(), {}) as any;
    const result = await controller.findAll(filter);

    expect(service.findAll).toHaveBeenCalledWith(filter);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a OrdersService.findOne', async () => {
    const order = mockOrder();
    service.findOne.mockResolvedValue(order);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(order);
  });

  it('create — delega a OrdersService.create', async () => {
    const dto: CreateOrderDto = {
      customerName: 'John',
      customerEmail: 'john@example.com',
      shippingAddress: {
        fullName: 'John',
        street: '123 Main St',
        city: 'NYC',
        state: 'NY',
        country: 'US',
        zipCode: '10001',
      },
      items: [{ productId: 1, quantity: 1 }],
    };
    const order = mockOrder();
    service.create.mockResolvedValue(order);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(order);
  });

  it('updateStatus — delega a OrdersService.updateStatus', async () => {
    const dto: UpdateOrderStatusDto = { status: ORDER_STATUS.PAID };
    const order = mockOrder();
    service.updateStatus.mockResolvedValue(order);

    const result = await controller.updateStatus(1, dto);

    expect(service.updateStatus).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(order);
  });

  it('remove — delega a OrdersService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
