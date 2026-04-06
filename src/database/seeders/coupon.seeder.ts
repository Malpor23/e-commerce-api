import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '@modules/coupons/entities/coupon.entity';
import { COUPON_SEED } from '../data/reviews-coupons.data';

@Injectable()
export class CouponSeeder {
  private readonly logger = new Logger(CouponSeeder.name);

  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
  ) {}

  async run(): Promise<void> {
    for (const data of COUPON_SEED) {
      const existing = await this.repo.findOneBy({ code: data.code });
      if (existing) continue;

      const coupon = this.repo.create({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount ?? null,
        maxUses: data.maxUses ?? null,
        expiresAt: data.expiresAt ?? null,
      });

      await this.repo.save(coupon);
      this.logger.log(
        `Coupon: ${coupon.code} — ${coupon.discountType} ${coupon.discountValue}`,
      );
    }
  }
}
