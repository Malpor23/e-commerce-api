import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import type { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { DISCOUNT_TYPE } from '@common/constants';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@common/dto/api-response.dto';
import type { Coupon } from './entities/coupon.entity';

const mockCoupon = (): Coupon =>
  ({ id: 1, code: 'SAVE20', discountType: DISCOUNT_TYPE.PERCENTAGE, discountValue: 20 }) as Coupon;

describe('CouponsController', () => {
  let controller: CouponsController;
  let service: jest.Mocked<CouponsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [
        {
          provide: CouponsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByCode: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
    service = module.get(CouponsService);
  });

  it('findAll — delega a CouponsService.findAll', async () => {
    const paginated = new PaginatedResponseDto([mockCoupon()], new PaginationMetaDto(1, 10, 1));
    service.findAll.mockResolvedValue(paginated);

    const result = await controller.findAll(new PaginationDto());

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toBe(paginated);
  });

  it('findOne — delega a CouponsService.findOne', async () => {
    const coupon = mockCoupon();
    service.findOne.mockResolvedValue(coupon);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(coupon);
  });

  it('findByCode — delega a CouponsService.findByCode', async () => {
    const coupon = mockCoupon();
    service.findByCode.mockResolvedValue(coupon);

    const result = await controller.findByCode('SAVE20');

    expect(service.findByCode).toHaveBeenCalledWith('SAVE20');
    expect(result).toBe(coupon);
  });

  it('create — delega a CouponsService.create', async () => {
    const dto: CreateCouponDto = {
      code: 'SAVE20',
      discountType: DISCOUNT_TYPE.PERCENTAGE,
      discountValue: 20,
    };
    const coupon = mockCoupon();
    service.create.mockResolvedValue(coupon);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(coupon);
  });

  it('update — delega a CouponsService.update', async () => {
    const dto: UpdateCouponDto = { discountValue: 30 };
    const coupon = mockCoupon();
    service.update.mockResolvedValue(coupon);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(coupon);
  });

  it('remove — delega a CouponsService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
