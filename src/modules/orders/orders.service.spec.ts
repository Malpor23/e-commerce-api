import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@modules/products/entities/product.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';
import { CouponsService } from '@modules/coupons/coupons.service';
import type { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ORDER_STATUS, DISCOUNT_TYPE } from '@common/constants';
import type { Coupon } from '@modules/coupons/entities/coupon.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    id: 1,
    name: 'iPhone 15',
    basePrice: 999,
    stock: 10,
    isActive: true,
    ...overrides,
  }) as Product;

const mockVariant = (overrides: Partial<ProductVariant> = {}): ProductVariant =>
  ({ id: 1, name: 'Black', price: 1099, stock: 5, ...overrides }) as ProductVariant;

const mockOrder = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 1,
    customerName: 'John',
    customerEmail: 'john@example.com',
    status: ORDER_STATUS.PENDING,
    subtotal: 999,
    discountAmount: 0,
    total: 999,
    coupon: null,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Order;

const mockCoupon = (): Coupon =>
  ({
    id: 1,
    code: 'SAVE20',
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: 20,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    expiresAt: null,
  }) as Coupon;

const buildQb = (data: Order[] = [], total = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrderRepo = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductRepo = { findOneBy: jest.fn() };
  const mockVariantRepo = { findOne: jest.fn() };

  const mockCouponsService = {
    validate: jest.fn(),
    incrementUsage: jest.fn(),
  };

  const mockManager = {
    decrement: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockImplementation((_cls, data) => data),
    save: jest.fn().mockImplementation((_cls, data) => Promise.resolve(data)),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation((cb) => cb(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: mockVariantRepo },
        { provide: CouponsService, useValue: mockCouponsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();

    mockManager.create.mockImplementation((_cls, data) => data);
    mockManager.save.mockImplementation((_cls, data) => Promise.resolve(data));
    mockManager.decrement.mockResolvedValue(undefined);
    mockDataSource.transaction.mockImplementation((cb) => cb(mockManager));
  });

  describe('findAll', () => {
    it('retorna resultado paginado sin filtros', async () => {
      const qb = buildQb([mockOrder()], 1);
      mockOrderRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10 }) as any;
      const result = await service.findAll(filter);

      expect(result.data).toHaveLength(1);
    });

    it('filtra por status', async () => {
      const qb = buildQb([], 0);
      mockOrderRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), {
        page: 1, limit: 10, status: ORDER_STATUS.PAID,
      }) as any;
      await service.findAll(filter);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('order.status'),
        { status: ORDER_STATUS.PAID },
      );
    });

    it('filtra por customerEmail', async () => {
      const qb = buildQb([], 0);
      mockOrderRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), {
        page: 1, limit: 10, customerEmail: 'john@example.com',
      }) as any;
      await service.findAll(filter);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('customerEmail'),
        { email: 'john@example.com' },
      );
    });
  });

  describe('findOne', () => {
    it('retorna la orden cuando existe', async () => {
      const order = mockOrder();
      mockOrderRepo.findOne.mockResolvedValue(order);

      expect(await service.findOne(1)).toEqual(order);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const baseDto: CreateOrderDto = {
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

    it('crea la orden correctamente sin cupón', async () => {
      const product = mockProduct();
      const savedOrder = mockOrder();

      mockProductRepo.findOneBy.mockResolvedValue(product);
      mockOrderRepo.findOne.mockResolvedValue(savedOrder);

      const result = await service.create(baseDto);

      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(result).toEqual(savedOrder);
    });

    it('aplica el cupón cuando se provee couponCode', async () => {
      const product = mockProduct();
      const coupon = mockCoupon();
      const savedOrder = mockOrder();

      mockProductRepo.findOneBy.mockResolvedValue(product);
      mockCouponsService.validate.mockResolvedValue(coupon);
      mockCouponsService.incrementUsage.mockResolvedValue(undefined);
      mockOrderRepo.findOne.mockResolvedValue(savedOrder);

      await service.create({ ...baseDto, couponCode: 'SAVE20' });

      expect(mockCouponsService.validate).toHaveBeenCalledWith('SAVE20', expect.any(Number));
      expect(mockCouponsService.incrementUsage).toHaveBeenCalledWith(coupon.id);
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create(baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si el producto no está activo', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct({ isActive: false }));

      await expect(service.create(baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si no hay suficiente stock', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct({ stock: 0 }));

      await expect(
        service.create({ ...baseDto, items: [{ productId: 1, quantity: 5 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('resuelve la variante cuando se provee variantId', async () => {
      const product = mockProduct();
      const variant = mockVariant();
      const savedOrder = mockOrder();

      mockProductRepo.findOneBy.mockResolvedValue(product);
      mockVariantRepo.findOne.mockResolvedValue(variant);
      mockOrderRepo.findOne.mockResolvedValue(savedOrder);

      await service.create({
        ...baseDto,
        items: [{ productId: 1, variantId: 1, quantity: 1 }],
      });

      expect(mockVariantRepo.findOne).toHaveBeenCalled();
    });

    it('lanza NotFoundException si la variante no existe', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct());
      mockVariantRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ ...baseDto, items: [{ productId: 1, variantId: 99, quantity: 1 }] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('actualiza el estado de la orden', async () => {
      const order = mockOrder();
      const dto: UpdateOrderStatusDto = { status: ORDER_STATUS.PAID };
      mockOrderRepo.findOne.mockResolvedValue(order);
      mockOrderRepo.save.mockResolvedValue({ ...order, status: ORDER_STATUS.PAID });

      await service.updateStatus(1, dto);

      expect(mockOrderRepo.save).toHaveBeenCalled();
    });

    it('lanza NotFoundException cuando la orden no existe', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(99, { status: ORDER_STATUS.PAID }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina la orden correctamente', async () => {
      mockOrderRepo.findOne.mockResolvedValue(mockOrder());
      mockOrderRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('lanza NotFoundException cuando la orden no existe', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
