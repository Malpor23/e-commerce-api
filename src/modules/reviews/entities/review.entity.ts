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
import { Product } from '@modules/products/entities/product.entity';

@Entity('reviews')
export class Review {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @Column({ type: 'smallint' })
  rating: number;

  @ApiPropertyOptional({ example: 'Excellent product!' })
  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string | null;

  @ApiPropertyOptional({ example: 'The build quality is outstanding.' })
  @Column({ type: 'text', nullable: true })
  body: string | null;

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'reviewer_name', length: 120 })
  reviewerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ name: 'reviewer_email', length: 200 })
  reviewerEmail: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
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
