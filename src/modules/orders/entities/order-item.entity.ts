import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '@modules/orders/entities/order.entity';
import { Product } from '@modules/products/entities/product.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 2 })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 999.99 })
  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unitPrice: number;

  @ApiProperty({ example: 1999.98 })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'Snapshot of the product at time of purchase' })
  @ManyToOne(() => Product, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiPropertyOptional({
    description: 'Specific variant selected by the customer',
  })
  @ManyToOne(() => ProductVariant, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
