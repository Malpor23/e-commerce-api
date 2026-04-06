import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '@modules/reviews/entities/review.entity';
import { Product } from '@modules/products/entities/product.entity';
import { REVIEW_SEED } from '../data/reviews-coupons.data';

@Injectable()
export class ReviewSeeder {
  private readonly logger = new Logger(ReviewSeeder.name);

  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
  ) {}

  async run(productMap: Map<string, Product>): Promise<void> {
    for (const data of REVIEW_SEED) {
      const product = productMap.get(data.productSlug);
      if (!product) {
        this.logger.warn(`Product not found for review: ${data.productSlug}`);
        continue;
      }

      const existing = await this.repo.findOne({
        where: {
          reviewerEmail: data.reviewerEmail,
          product: { id: product.id },
        },
      });
      if (existing) continue;

      const review = this.repo.create({
        rating: data.rating,
        title: data.title,
        body: data.body,
        reviewerName: data.reviewerName,
        reviewerEmail: data.reviewerEmail,
        product,
      });

      await this.repo.save(review);
      this.logger.log(`Review: "${data.title}" on ${product.name}`);
    }
  }
}
