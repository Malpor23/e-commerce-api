import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as constants from '@common/constants';
import { Order } from '@modules/orders/entities/order.entity';

@Entity('coupons')
export class Coupon {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'SAVE20' })
  @Column({ length: 60, unique: true })
  code: string;

  @ApiProperty({
    enum: constants.DISCOUNT_TYPE,
    example: constants.DISCOUNT_TYPE.PERCENTAGE,
  })
  @Column({ name: 'discount_type', length: 20 })
  discountType: constants.DiscountType;

  @ApiProperty({ example: 20 })
  @Column({ name: 'discount_value', type: 'numeric', precision: 10, scale: 2 })
  discountValue: number;

  @ApiPropertyOptional({ example: 50 })
  @Column({
    name: 'min_order_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minOrderAmount: number | null;

  @ApiPropertyOptional({ example: 100 })
  @Column({ name: 'max_uses', type: 'int', nullable: true })
  maxUses: number | null;

  @ApiProperty({ example: 0 })
  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount: number;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Order[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
