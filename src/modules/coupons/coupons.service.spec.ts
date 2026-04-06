import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import type { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { DISCOUNT_TYPE } from '@common/constants';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockCoupon = (overrides: Partial<Coupon> = {}): Coupon =>
  ({
    id: 1,
    code: 'SAVE20',
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: 20,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    expiresAt: null,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Coupon;

const buildQb = (data: Coupon[] = [], total = 0) => ({
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('CouponsService', () => {
  let service: CouponsService;

  const mockRepo = {
    createQueryBuilder: jest.fn(),
    findOneBy: jest.fn(),
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    increment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: getRepositoryToken(Coupon), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado', async () => {
      const qb = buildQb([mockCoupon()], 1);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), { page: 1, limit: 10 });
      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('retorna el cupón cuando existe', async () => {
      const coupon = mockCoupon();
      mockRepo.findOneBy.mockResolvedValue(coupon);

      expect(await service.findOne(1)).toEqual(coupon);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    it('retorna el cupón al buscar por código', async () => {
      const coupon = mockCoupon();
      mockRepo.findOneBy.mockResolvedValue(coupon);

      expect(await service.findByCode('save20')).toEqual(coupon);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ code: 'SAVE20' });
    });

    it('lanza NotFoundException cuando el código no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findByCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validate', () => {
    it('retorna el cupón cuando es válido', async () => {
      const coupon = mockCoupon();
      mockRepo.findOneBy.mockResolvedValue(coupon);

      expect(await service.validate('SAVE20', 200)).toEqual(coupon);
    });

    it('lanza BadRequestException cuando el cupón ha expirado', async () => {
      const expired = mockCoupon({ expiresAt: new Date('2000-01-01') });
      mockRepo.findOneBy.mockResolvedValue(expired);

      await expect(service.validate('SAVE20', 200)).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException cuando se alcanzó el límite de usos', async () => {
      const exhausted = mockCoupon({ maxUses: 5, usedCount: 5 });
      mockRepo.findOneBy.mockResolvedValue(exhausted);

      await expect(service.validate('SAVE20', 200)).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si el pedido no alcanza el mínimo', async () => {
      const coupon = mockCoupon({ minOrderAmount: 500 });
      mockRepo.findOneBy.mockResolvedValue(coupon);

      await expect(service.validate('SAVE20', 100)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    const dto: CreateCouponDto = {
      code: 'new20',
      discountType: DISCOUNT_TYPE.PERCENTAGE,
      discountValue: 20,
    };

    it('crea el cupón con el código en mayúsculas', async () => {
      const coupon = mockCoupon({ code: 'NEW20' });
      mockRepo.existsBy.mockResolvedValue(false);
      mockRepo.create.mockReturnValue(coupon);
      mockRepo.save.mockResolvedValue(coupon);

      const result = await service.create(dto);

      expect(mockRepo.existsBy).toHaveBeenCalledWith({ code: 'NEW20' });
      expect(result.code).toBe('NEW20');
    });

    it('lanza ConflictException si el código ya existe', async () => {
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('actualiza el cupón', async () => {
      const coupon = mockCoupon();
      const dto: UpdateCouponDto = { discountValue: 30 };
      mockRepo.findOneBy.mockResolvedValue(coupon);
      mockRepo.save.mockResolvedValue({ ...coupon, discountValue: 30 });

      const result = await service.update(1, dto);

      expect(result.discountValue).toBe(30);
    });

    it('lanza ConflictException si el nuevo código ya está en uso', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockCoupon({ code: 'OLD' }));
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { code: 'TAKEN' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('elimina el cupón correctamente', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockCoupon());
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('incrementUsage', () => {
    it('incrementa el contador de usos', async () => {
      mockRepo.increment.mockResolvedValue(undefined);

      await service.incrementUsage(1);

      expect(mockRepo.increment).toHaveBeenCalledWith({ id: 1 }, 'usedCount', 1);
    });
  });
});
