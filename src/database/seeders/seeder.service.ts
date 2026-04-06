import { Injectable, Logger } from '@nestjs/common';
import { CategorySeeder } from './category.seeder';
import { BrandSeeder } from './brand.seeder';
import { TagSeeder } from './tag.seeder';
import { ProductSeeder } from './product.seeder';
import { ReviewSeeder } from './review.seeder';
import { CouponSeeder } from './coupon.seeder';

@Injectable()
export class SeederService {
  private readonly logger = new Logger('Seeder');

  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly brandSeeder: BrandSeeder,
    private readonly tagSeeder: TagSeeder,
    private readonly productSeeder: ProductSeeder,
    private readonly reviewSeeder: ReviewSeeder,
    private readonly couponSeeder: CouponSeeder,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seed…');

    this.logger.log('Categories');
    const categoryMap = await this.categorySeeder.run();

    this.logger.log('Brands');
    const brandMap = await this.brandSeeder.run();

    this.logger.log('Tags');
    const tagMap = await this.tagSeeder.run();

    this.logger.log('Products');
    const productMap = await this.productSeeder.run(
      categoryMap,
      brandMap,
      tagMap,
    );

    this.logger.log('Reviews');
    await this.reviewSeeder.run(productMap);

    this.logger.log('Coupons');
    await this.couponSeeder.run();

    this.logger.log(`Seed complete — ${productMap.size} products loaded`);
  }
}
