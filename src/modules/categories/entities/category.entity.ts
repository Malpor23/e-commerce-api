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

@Entity('categories')
export class Category {
  @ApiProperty({
    example: '1',
    description: 'Unique identifier (integer)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Smartphones' })
  @Column({ length: 120 })
  name: string;

  @ApiProperty({ example: 'smartphones' })
  @Column({ length: 140, unique: true })
  slug: string;

  @ApiPropertyOptional({ example: 'Latest smartphones and accessories' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiPropertyOptional({ type: () => Category })
  @ManyToOne(() => Category, (cat) => cat.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @ApiPropertyOptional({ type: () => [Category] })
  @OneToMany(() => Category, (cat) => cat.parent)
  children: Category[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
