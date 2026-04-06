import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';

@Entity('tags')
export class Tag {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'wireless' })
  @Column({ length: 80 })
  name: string;

  @ApiProperty({ example: 'wireless' })
  @Column({ length: 100, unique: true })
  slug: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
