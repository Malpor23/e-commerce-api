import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';

@Entity('brands')
export class Brand {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Apple' })
  @Column({ length: 120 })
  name: string;

  @ApiProperty({ example: 'apple' })
  @Column({ length: 140, unique: true })
  slug: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logos/apple.png' })
  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string | null;

  @ApiPropertyOptional({ example: 'Think different.' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiPropertyOptional({ example: 'United States' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @OneToMany(() => Product, (product) => product.brand)
  photos: Product[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
