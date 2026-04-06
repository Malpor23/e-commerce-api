import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '@modules/coupons/entities/coupon.entity';
import { CouponsController } from '@modules/coupons/coupons.controller';
import { CouponsService } from '@modules/coupons/coupons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
