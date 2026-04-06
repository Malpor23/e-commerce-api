import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import { IBaseService } from '@common/interfaces/base-service.interface';

@Injectable()
export class CouponsService implements IBaseService<
  Coupon,
  CreateCouponDto,
  UpdateCouponDto
> {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Coupon>> {
    const qb = this.couponRepo
      .createQueryBuilder('coupon')
      .orderBy('coupon.createdAt', 'DESC');

    if (pagination.search) {
      qb.where('LOWER(coupon.code) LIKE LOWER(:search)', {
        search: `%${pagination.search}%`,
      });
    }

    const [data, total] = await qb
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(pagination.page, pagination.limit, total),
    );
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepo.findOneBy({ id });
    if (!coupon)
      throw new NotFoundException(`Coupon with id "${id}" not found`);
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOneBy({
      code: code.toUpperCase(),
    });
    if (!coupon) throw new NotFoundException(`Coupon "${code}" not found`);
    return coupon;
  }

  async validate(code: string, subtotal: number): Promise<Coupon> {
    const coupon = await this.findByCode(code);

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException(`Coupon "${code}" has expired`);
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException(
        `Coupon "${code}" has reached its usage limit`,
      );
    }
    if (coupon.minOrderAmount !== null && subtotal < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Order must be at least ${coupon.minOrderAmount} to use coupon "${code}"`,
      );
    }

    return coupon;
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const code = dto.code.toUpperCase();
    const exists = await this.couponRepo.existsBy({ code });
    if (exists)
      throw new ConflictException(`Coupon code "${code}" already exists`);

    const coupon = this.couponRepo.create({
      ...dto,
      code,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });

    return this.couponRepo.save(coupon);
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    if (dto.code) {
      const code = dto.code.toUpperCase();
      if (code !== coupon.code) {
        const exists = await this.couponRepo.existsBy({ code });
        if (exists)
          throw new ConflictException(`Coupon code "${code}" already exists`);
        coupon.code = code;
      }
    }

    Object.assign(coupon, {
      discountType: dto.discountType ?? coupon.discountType,
      discountValue: dto.discountValue ?? coupon.discountValue,
      minOrderAmount: dto.minOrderAmount ?? coupon.minOrderAmount,
      maxUses: dto.maxUses ?? coupon.maxUses,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : coupon.expiresAt,
    });

    return this.couponRepo.save(coupon);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepo.remove(coupon);
  }

  async incrementUsage(id: number): Promise<void> {
    await this.couponRepo.increment({ id }, 'usedCount', 1);
  }
}
