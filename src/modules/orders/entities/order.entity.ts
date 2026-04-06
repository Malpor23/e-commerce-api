import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as constants from '@common/constants';
import { Coupon } from '@modules/coupons/entities/coupon.entity';
import { OrderItem } from './order-item.entity';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
}

@Entity('orders')
export class Order {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: constants.ORDER_STATUS,
    example: constants.ORDER_STATUS.PENDING,
  })
  @Column({ length: 30, default: constants.ORDER_STATUS.PENDING })
  status: constants.OrderStatus;

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'customer_name', length: 160 })
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ name: 'customer_email', length: 200 })
  customerEmail: string;

  @ApiProperty({ example: 199.98 })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal: number;

  @ApiProperty({ example: 39.99 })
  @Column({
    name: 'discount_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @ApiProperty({ example: 159.99 })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number;

  @ApiProperty({
    example: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'US',
      zipCode: '10001',
    },
  })
  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddress: ShippingAddress;

  @ApiPropertyOptional({ type: () => Coupon })
  @ManyToOne(() => Coupon, (coupon) => coupon.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
