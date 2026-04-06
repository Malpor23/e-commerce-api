import { Coupon } from '@modules/coupons/entities/coupon.entity';
import { DISCOUNT_TYPE } from '@common/constants';

export interface PricingResult {
  subtotal: number;
  discountAmount: number;
  total: number;
}

export class OrderCalculator {
  static calculate(
    lineItems: Array<{ unitPrice: number; quantity: number }>,
    coupon?: Coupon | null,
  ): PricingResult {
    const subtotal = OrderCalculator.sumLineItems(lineItems);
    const discountAmount = coupon
      ? OrderCalculator.applyDiscount(subtotal, coupon)
      : 0;

    return {
      subtotal: OrderCalculator.round(subtotal),
      discountAmount: OrderCalculator.round(discountAmount),
      total: OrderCalculator.round(Math.max(0, subtotal - discountAmount)),
    };
  }

  private static sumLineItems(
    items: Array<{ unitPrice: number; quantity: number }>,
  ): number {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }

  private static applyDiscount(subtotal: number, coupon: Coupon): number {
    if (coupon.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      return subtotal * (coupon.discountValue / 100);
    }
    return Math.min(coupon.discountValue, subtotal);
  }

  static round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
