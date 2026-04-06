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

@Entity('product_images')
export class ProductImage {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'https://cdn.example.com/products/iphone-front.jpg' })
  @Column()
  url: string;

  @ApiPropertyOptional({ example: 'iPhone 15 Pro front view' })
  @Column({ name: 'alt_text', type: 'varchar', nullable: true })
  altText: string | null;

  @ApiProperty({ example: false })
  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ApiProperty({ example: 0 })
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Product, (product) => product.images, {
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
