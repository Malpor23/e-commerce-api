import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Product } from '@modules/products/entities/product.entity';
import type { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockProduct = (id = 1): Product => ({ id, name: 'iPhone', isActive: true } as Product);

const mockReview = (overrides: Partial<Review> = {}): Review =>
  ({
    id: 1,
    rating: 5,
    title: 'Great!',
    body: 'Loved it.',
    reviewerName: 'John',
    reviewerEmail: 'john@example.com',
    product: mockProduct(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Review;

const buildQb = (data: Review[] = [], total = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReviewRepo = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: mockReviewRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado sin filtros', async () => {
      const qb = buildQb([mockReview()], 1);
      mockReviewRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10 });
      const result = await service.findAll(filter as any);

      expect(result.data).toHaveLength(1);
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('filtra por productId cuando se provee', async () => {
      const qb = buildQb([], 0);
      mockReviewRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10, productId: 5 });
      await service.findAll(filter as any);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('product.id'),
        { productId: 5 },
      );
    });

    it('filtra por rating cuando se provee', async () => {
      const qb = buildQb([], 0);
      mockReviewRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10, rating: 5 });
      await service.findAll(filter as any);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('review.rating'),
        { rating: 5 },
      );
    });
  });

  describe('findOne', () => {
    it('retorna la reseña cuando existe', async () => {
      const review = mockReview();
      mockReviewRepo.findOne.mockResolvedValue(review);

      expect(await service.findOne(1)).toEqual(review);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockReviewRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateReviewDto = {
      rating: 5,
      reviewerName: 'John',
      reviewerEmail: 'john@example.com',
      productId: 1,
    };

    it('crea la reseña correctamente', async () => {
      const product = mockProduct();
      const review = mockReview();
      mockProductRepo.findOneBy.mockResolvedValue(product);
      mockReviewRepo.create.mockReturnValue(review);
      mockReviewRepo.save.mockResolvedValue(review);

      const result = await service.create(dto);

      expect(mockProductRepo.findOneBy).toHaveBeenCalledWith({ id: dto.productId });
      expect(result).toEqual(review);
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('asigna null a title y body cuando no se proveen', async () => {
      mockProductRepo.findOneBy.mockResolvedValue(mockProduct());
      mockReviewRepo.create.mockImplementation((data) => data);
      mockReviewRepo.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.create(dto);

      expect(result.title).toBeNull();
      expect(result.body).toBeNull();
    });
  });

  describe('update', () => {
    it('actualiza la reseña', async () => {
      const review = mockReview();
      const dto: UpdateReviewDto = { rating: 4 };
      mockReviewRepo.findOne.mockResolvedValue(review);
      mockReviewRepo.save.mockResolvedValue({ ...review, rating: 4 });

      const result = await service.update(1, dto);

      expect(result.rating).toBe(4);
    });

    it('lanza NotFoundException cuando la reseña no existe', async () => {
      mockReviewRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina la reseña correctamente', async () => {
      mockReviewRepo.findOne.mockResolvedValue(mockReview());
      mockReviewRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('lanza NotFoundException cuando la reseña no existe', async () => {
      mockReviewRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
