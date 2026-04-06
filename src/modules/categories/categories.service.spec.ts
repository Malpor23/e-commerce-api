import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import type { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockCategory = (overrides: Partial<Category> = {}): Category =>
  ({
    id: 1,
    name: 'Smartphones',
    slug: 'smartphones',
    description: null,
    parent: null,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Category;

const buildQb = (data: Category[] = [], total = 0) => ({
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockRepo = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado', async () => {
      const qb = buildQb([mockCategory()], 1);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), {
        page: 1,
        limit: 10,
      });
      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('aplica búsqueda cuando se provee search', async () => {
      const qb = buildQb([], 0);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), {
        page: 1,
        limit: 10,
        search: 'smart',
      });
      await service.findAll(pagination);

      expect(qb.where).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%smart%' }),
      );
    });
  });

  describe('findOne', () => {
    it('retorna la categoría con relaciones', async () => {
      const category = mockCategory();
      mockRepo.findOne.mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(result).toEqual(category);
      expect(mockRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateCategoryDto = { name: 'Smartphones', slug: 'smartphones' };

    it('crea categoría sin padre', async () => {
      const category = mockCategory();
      mockRepo.existsBy.mockResolvedValue(false);
      mockRepo.create.mockReturnValue(category);
      mockRepo.save.mockResolvedValue(category);

      expect(await service.create(dto)).toEqual(category);
    });

    it('crea categoría con padre cuando se provee parentId', async () => {
      mockRepo.existsBy.mockResolvedValue(false);
      mockRepo.create.mockImplementation((data) => data);
      mockRepo.save.mockImplementation((data) => Promise.resolve(data));

      const dtoWithParent: CreateCategoryDto = { ...dto, parentId: 5 };
      const result = await service.create(dtoWithParent);

      expect(result.parent).toEqual({ id: 5 });
    });

    it('lanza ConflictException cuando el slug ya existe', async () => {
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('actualiza y retorna la categoría', async () => {
      const category = mockCategory();
      const dto: UpdateCategoryDto = { name: 'Mobile Phones' };
      mockRepo.findOne.mockResolvedValue(category);
      mockRepo.save.mockResolvedValue({ ...category, ...dto });

      const result = await service.update(1, dto);

      expect(result.name).toBe('Mobile Phones');
    });

    it('lanza NotFoundException cuando la categoría no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el nuevo slug ya está en uso', async () => {
      mockRepo.findOne.mockResolvedValue(mockCategory({ slug: 'old' }));
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { slug: 'taken' })).rejects.toThrow(ConflictException);
    });

    it('actualiza el padre cuando se provee parentId', async () => {
      const category = mockCategory();
      const dto: UpdateCategoryDto = { parentId: 10 };
      mockRepo.findOne.mockResolvedValue(category);
      mockRepo.save.mockImplementation((c) => Promise.resolve(c));

      const result = await service.update(1, dto);

      expect(result.parent).toEqual({ id: 10 });
    });

    it('limpia el padre cuando parentId es 0 / falsy', async () => {
      const category = mockCategory({ parent: { id: 5 } as Category });
      const dto: UpdateCategoryDto = { parentId: 0 };
      mockRepo.findOne.mockResolvedValue(category);
      mockRepo.save.mockImplementation((c) => Promise.resolve(c));

      const result = await service.update(1, dto);

      expect(result.parent).toBeNull();
    });
  });

  describe('remove', () => {
    it('elimina la categoría correctamente', async () => {
      const category = mockCategory();
      mockRepo.findOne.mockResolvedValue(category);
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('lanza NotFoundException cuando la categoría no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
