import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@modules/categories/entities/category.entity';
import { Brand } from '@modules/brands/entities/brand.entity';
import { Tag } from '@modules/tags/entities/tag.entity';
import { Product } from '@modules/products/entities/product.entity';
import { ProductImage } from '@modules/products/entities/product-image.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';
import { Review } from '@modules/reviews/entities/review.entity';
import { Coupon } from '@modules/coupons/entities/coupon.entity';
import { CategorySeeder } from './category.seeder';
import { BrandSeeder } from './brand.seeder';
import { TagSeeder } from './tag.seeder';
import { ProductSeeder } from './product.seeder';
import { ReviewSeeder } from './review.seeder';
import { CouponSeeder } from './coupon.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Brand,
      Tag,
      Product,
      ProductImage,
      ProductVariant,
      Review,
      Coupon,
    ]),
  ],
  providers: [
    CategorySeeder,
    BrandSeeder,
    TagSeeder,
    ProductSeeder,
    ReviewSeeder,
    CouponSeeder,
    SeederService,
  ],
  exports: [SeederService],
})
export class SeederModule {}
