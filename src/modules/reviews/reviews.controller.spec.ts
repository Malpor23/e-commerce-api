import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import type { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@common/dto/api-response.dto';
import type { Review } from './entities/review.entity';

const mockReview = (): Review => ({ id: 1, rating: 5, reviewerName: 'John' }) as Review;

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: jest.Mocked<ReviewsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get(ReviewsService);
  });

  it('findAll — delega a ReviewsService.findAll', async () => {
    const paginated = new PaginatedResponseDto([mockReview()], new PaginationMetaDto(1, 10, 1));
    service.findAll.mockResolvedValue(paginated);

    const filter = Object.assign(new PaginationDto(), {}) as any;
    const result = await controller.findAll(filter);

    expect(service.findAll).toHaveBeenCalledWith(filter);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a ReviewsService.findOne', async () => {
    const review = mockReview();
    service.findOne.mockResolvedValue(review);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(review);
  });

  it('create — delega a ReviewsService.create', async () => {
    const dto: CreateReviewDto = {
      rating: 5,
      reviewerName: 'John',
      reviewerEmail: 'john@example.com',
      productId: 1,
    };
    const review = mockReview();
    service.create.mockResolvedValue(review);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(review);
  });

  it('update — delega a ReviewsService.update', async () => {
    const dto: UpdateReviewDto = { rating: 4 };
    const review = mockReview();
    service.update.mockResolvedValue(review);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(review);
  });

  it('remove — delega a ReviewsService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
