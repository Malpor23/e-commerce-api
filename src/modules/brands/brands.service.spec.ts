import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import type { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockBrand = (overrides: Partial<Brand> = {}): Brand =>
  ({
    id: 1,
    name: 'Apple',
    slug: 'apple',
    logoUrl: null,
    description: null,
    country: null,
    photos: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Brand;

const buildQb = (data: Brand[] = [], total = 0) => ({
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('BrandsService', () => {
  let service: BrandsService;

  const mockRepo = {
    createQueryBuilder: jest.fn(),
    findOneBy: jest.fn(),
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        { provide: getRepositoryToken(Brand), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado sin búsqueda', async () => {
      const brand = mockBrand();
      const qb = buildQb([brand], 1);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), {
        page: 1,
        limit: 10,
      });
      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(qb.where).not.toHaveBeenCalled();
    });

    it('aplica filtro de búsqueda cuando se provee search', async () => {
      const qb = buildQb([], 0);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), {
        page: 1,
        limit: 10,
        search: 'app',
      });
      await service.findAll(pagination);

      expect(qb.where).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%app%' }),
      );
    });
  });

  describe('findOne', () => {
    it('retorna la marca cuando existe', async () => {
      const brand = mockBrand();
      mockRepo.findOneBy.mockResolvedValue(brand);

      const result = await service.findOne(1);

      expect(result).toEqual(brand);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateBrandDto = { name: 'Apple', slug: 'apple' };

    it('crea y retorna la marca', async () => {
      const brand = mockBrand();
      mockRepo.existsBy.mockResolvedValue(false);
      mockRepo.create.mockReturnValue(brand);
      mockRepo.save.mockResolvedValue(brand);

      const result = await service.create(dto);

      expect(result).toEqual(brand);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
    });

    it('lanza ConflictException cuando el slug ya existe', async () => {
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const dto: UpdateBrandDto = { name: 'Apple Inc.' };

    it('actualiza y retorna la marca', async () => {
      const brand = mockBrand();
      mockRepo.findOneBy.mockResolvedValue(brand);
      mockRepo.save.mockResolvedValue({ ...brand, ...dto });

      const result = await service.update(1, dto);

      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Apple Inc.');
    });

    it('lanza NotFoundException cuando la marca no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el nuevo slug ya está en uso', async () => {
      const brand = mockBrand({ slug: 'old-slug' });
      mockRepo.findOneBy.mockResolvedValue(brand);
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { slug: 'taken-slug' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('no verifica unicidad si el slug no cambia', async () => {
      const brand = mockBrand({ slug: 'apple' });
      mockRepo.findOneBy.mockResolvedValue(brand);
      mockRepo.save.mockResolvedValue(brand);

      await service.update(1, { slug: 'apple' });

      expect(mockRepo.existsBy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('elimina la marca correctamente', async () => {
      const brand = mockBrand();
      mockRepo.findOneBy.mockResolvedValue(brand);
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(mockRepo.remove).toHaveBeenCalledWith(brand);
    });

    it('lanza NotFoundException cuando la marca no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
