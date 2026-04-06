import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import type { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import type { Category } from './entities/category.entity';

const mockCategory = (): Category =>
  ({ id: 1, name: 'Smartphones', slug: 'smartphones' }) as Category;

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
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

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService);
  });

  it('findAll — delega a CategoriesService.findAll', async () => {
    const paginated = new PaginatedResponseDto(
      [mockCategory()],
      new PaginationMetaDto(1, 10, 1),
    );
    service.findAll.mockResolvedValue(paginated);

    const pagination = new PaginationDto();
    const result = await controller.findAll(pagination);

    expect(service.findAll).toHaveBeenCalledWith(pagination);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a CategoriesService.findOne', async () => {
    const category = mockCategory();
    service.findOne.mockResolvedValue(category);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(category);
  });

  it('create — delega a CategoriesService.create', async () => {
    const dto: CreateCategoryDto = { name: 'Smartphones', slug: 'smartphones' };
    const category = mockCategory();
    service.create.mockResolvedValue(category);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(category);
  });

  it('update — delega a CategoriesService.update', async () => {
    const dto: UpdateCategoryDto = { name: 'Mobile Phones' };
    const category = mockCategory();
    service.update.mockResolvedValue(category);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(category);
  });

  it('remove — delega a CategoriesService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
