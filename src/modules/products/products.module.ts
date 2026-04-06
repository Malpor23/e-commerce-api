import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@modules/products/entities/product.entity';
import { ProductImage } from '@modules/products/entities/product-image.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';
import { ProductsController } from '@modules/products/products.controller';
import { ProductsService } from '@modules/products/products.service';
import { Tag } from '@modules/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductVariant, Tag]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
