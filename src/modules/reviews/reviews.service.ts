import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import {
  CreateReviewDto,
  ReviewFilterDto,
  UpdateReviewDto,
} from './dto/review.dto';
import { Product } from '@modules/products/entities/product.entity';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(
    filter: ReviewFilterDto,
  ): Promise<PaginatedResponseDto<Review>> {
    const qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .orderBy('review.createdAt', 'DESC');

    if (filter.productId) {
      qb.andWhere('product.id = :productId', { productId: filter.productId });
    }
    if (filter.rating !== undefined) {
      qb.andWhere('review.rating = :rating', { rating: filter.rating });
    }

    const [data, total] = await qb
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(filter.page, filter.limit, total),
    );
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: { product: true },
    });
    if (!review)
      throw new NotFoundException(`Review with id "${id}" not found`);
    return review;
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException(
        `Product with id "${dto.productId}" not found`,
      );
    }

    const review = this.reviewRepo.create({
      rating: dto.rating,
      title: dto.title ?? null,
      body: dto.body ?? null,
      reviewerName: dto.reviewerName,
      reviewerEmail: dto.reviewerEmail,
      product,
    });

    return this.reviewRepo.save(review);
  }

  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, {
      rating: dto.rating ?? review.rating,
      title: dto.title ?? review.title,
      body: dto.body ?? review.body,
      reviewerName: dto.reviewerName ?? review.reviewerName,
      reviewerEmail: dto.reviewerEmail ?? review.reviewerEmail,
    });
    return this.reviewRepo.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepo.remove(review);
  }
}
