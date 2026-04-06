import { OrderCalculator } from './order-calculator';
import type { Coupon } from '@modules/coupons/entities/coupon.entity';
import { DISCOUNT_TYPE } from '@common/constants';

const makeCoupon = (overrides: Partial<Coupon>): Coupon =>
  ({
    id: 1,
    code: 'TEST',
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: 10,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    expiresAt: null,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Coupon;

const items = (list: Array<{ unitPrice: number; quantity: number }>) => list;

describe('OrderCalculator', () => {
  describe('round', () => {
    it('redondea hacia arriba cuando el tercer decimal >= 5', () => {
      expect(OrderCalculator.round(1.236)).toBe(1.24);
      expect(OrderCalculator.round(0.007)).toBe(0.01);
    });

    it('trunca cuando el tercer decimal < 5', () => {
      expect(OrderCalculator.round(1.234)).toBe(1.23);
      expect(OrderCalculator.round(9.991)).toBe(9.99);
    });

    it('mantiene valores exactos sin cambios', () => {
      expect(OrderCalculator.round(99.99)).toBe(99.99);
      expect(OrderCalculator.round(10)).toBe(10);
      expect(OrderCalculator.round(0)).toBe(0);
    });
  });

  describe('calculate — sin cupón', () => {
    it('calcula subtotal, descuento 0 y total iguales', () => {
      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 2 }]),
      );

      expect(result.subtotal).toBe(200);
      expect(result.discountAmount).toBe(0);
      expect(result.total).toBe(200);
    });

    it('suma múltiples ítems', () => {
      const result = OrderCalculator.calculate(
        items([
          { unitPrice: 50, quantity: 3 },
          { unitPrice: 25.5, quantity: 2 },
        ]),
      );

      expect(result.subtotal).toBe(201);
      expect(result.total).toBe(201);
    });

    it('retorna ceros para lista vacía', () => {
      const result = OrderCalculator.calculate([]);

      expect(result.subtotal).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.total).toBe(0);
    });

    it('redondea el subtotal a 2 decimales', () => {
      const result = OrderCalculator.calculate(
        items([{ unitPrice: 0.1, quantity: 3 }]),
      );

      expect(result.subtotal).toBe(0.3);
    });
  });

  describe('calculate — cupón porcentual', () => {
    it('aplica descuento porcentual al subtotal', () => {
      const coupon = makeCoupon({
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 20,
      });

      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 1 }]),
        coupon,
      );

      expect(result.subtotal).toBe(100);
      expect(result.discountAmount).toBe(20);
      expect(result.total).toBe(80);
    });

    it('aplica descuento del 100% → total 0', () => {
      const coupon = makeCoupon({
        discountType: DISCOUNT_TYPE.PERCENTAGE,
        discountValue: 100,
      });

      const result = OrderCalculator.calculate(
        items([{ unitPrice: 50, quantity: 2 }]),
        coupon,
      );

      expect(result.total).toBe(0);
    });
  });

  describe('calculate — cupón de monto fijo', () => {
    it('aplica descuento fijo menor al subtotal', () => {
      const coupon = makeCoupon({
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 30,
      });

      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 1 }]),
        coupon,
      );

      expect(result.discountAmount).toBe(30);
      expect(result.total).toBe(70);
    });

    it('no supera el subtotal — total nunca negativo', () => {
      const coupon = makeCoupon({
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 500,
      });

      const result = OrderCalculator.calculate(
        items([{ unitPrice: 10, quantity: 1 }]),
        coupon,
      );

      expect(result.discountAmount).toBe(10);
      expect(result.total).toBe(0);
    });

    it('descuento exactamente igual al subtotal → total 0', () => {
      const coupon = makeCoupon({
        discountType: DISCOUNT_TYPE.FIXED,
        discountValue: 100,
      });

      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 1 }]),
        coupon,
      );

      expect(result.total).toBe(0);
    });
  });

  describe('calculate — con cupón null/undefined', () => {
    it('trata null igual que sin cupón', () => {
      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 1 }]),
        null,
      );

      expect(result.discountAmount).toBe(0);
      expect(result.total).toBe(100);
    });

    it('trata undefined igual que sin cupón', () => {
      const result = OrderCalculator.calculate(
        items([{ unitPrice: 100, quantity: 1 }]),
        undefined,
      );

      expect(result.discountAmount).toBe(0);
      expect(result.total).toBe(100);
    });
  });
});
