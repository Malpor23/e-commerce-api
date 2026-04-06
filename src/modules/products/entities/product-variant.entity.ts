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
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Large / Red' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ example: 'APPL-IP15P-128-L-RED' })
  @Column({ length: 100, unique: true })
  sku: string;

  @ApiPropertyOptional({ example: 1049.99 })
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number | null;

  @ApiProperty({ example: 10 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiPropertyOptional({
    example: { size: 'L', color: 'Red' },
    description: 'Flexible key-value map of variant axes',
  })
  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, string> | null;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
