import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '@modules/categories/entities/category.entity';
import { Brand } from '@modules/brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { Tag } from '@modules/tags/entities/tag.entity';
import { Review } from '@modules/reviews/entities/review.entity';

@Entity('products')
export class Product {
  @ApiProperty({
    example: 2,
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  @Column({ length: 220, unique: true })
  slug: string;

  @ApiPropertyOptional({ example: 'The latest iPhone with titanium design.' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ example: 999.99 })
  @Column({ name: 'base_price', type: 'numeric', precision: 12, scale: 2 })
  basePrice: number;

  @ApiProperty({ example: 'APPL-IP15P-128' })
  @Column({ length: 100, unique: true })
  sku: string;

  @ApiProperty({ example: 50 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @ManyToOne(() => Brand, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand | null;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  variants: ProductVariant[];

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @OneToMany(() => Review, (r) => r.product)
  reviews: Review[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
