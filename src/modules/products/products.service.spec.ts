import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Tag } from '@modules/tags/entities/tag.entity';
import type { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    id: 1,
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: null,
    basePrice: 999,
    sku: 'APPL-IP15',
    stock: 10,
    isActive: true,
    category: null,
    brand: null,
    images: [],
    variants: [],
    tags: [],
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Product;

const mockTag = (id: number): Tag => ({ id, name: 'tag', slug: 'tag', products: [] }) as Tag;

const buildQb = (data: Product[] = [], total = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepo = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockTagRepo = {
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(Tag), useValue: mockTagRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado sin filtros', async () => {
      const qb = buildQb([mockProduct()], 1);
      mockProductRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10 }) as any;
      const result = await service.findAll(filter);

      expect(result.data).toHaveLength(1);
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('aplica filtro de búsqueda', async () => {
      const qb = buildQb([], 0);
      mockProductRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10, search: 'iphone' }) as any;
      await service.findAll(filter);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%iphone%' }),
      );
    });

    it('aplica filtro por categoryId', async () => {
      const qb = buildQb([], 0);
      mockProductRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10, categoryId: 3 }) as any;
      await service.findAll(filter);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('category.id'),
        { categoryId: 3 },
      );
    });

    it('aplica filtro por precio mínimo y máximo', async () => {
      const qb = buildQb([], 0);
      mockProductRepo.createQueryBuilder.mockReturnValue(qb);

      const filter = Object.assign(new PaginationDto(), { page: 1, limit: 10, minPrice: 100, maxPrice: 500 }) as any;
      await service.findAll(filter);

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('basePrice >='),
        { minPrice: 100 },
      );
      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('basePrice <='),
        { maxPrice: 500 },
      );
    });
  });

  describe('findOne', () => {
    it('retorna el producto con relaciones', async () => {
      const product = mockProduct();
      mockProductRepo.findOne.mockResolvedValue(product);

      expect(await service.findOne(1)).toEqual(product);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateProductDto = {
      name: 'iPhone 15',
      slug: 'iphone-15',
      basePrice: 999,
      sku: 'APPL-IP15',
    };

    it('crea el producto correctamente', async () => {
      const product = mockProduct();
      mockProductRepo.existsBy.mockResolvedValue(false);
      mockProductRepo.create.mockReturnValue(product);
      mockProductRepo.save.mockResolvedValue(product);

      expect(await service.create(dto)).toEqual(product);
    });

    it('lanza ConflictException si el slug ya existe', async () => {
      mockProductRepo.existsBy.mockResolvedValueOnce(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('lanza ConflictException si el SKU ya existe', async () => {
      mockProductRepo.existsBy
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('resuelve y asigna tags cuando se proveen tagIds', async () => {
      const tags = [mockTag(1), mockTag(2)];
      mockProductRepo.existsBy.mockResolvedValue(false);
      mockProductRepo.create.mockReturnValue(mockProduct());
      mockTagRepo.findBy.mockResolvedValue(tags);
      mockProductRepo.save.mockImplementation((p) => Promise.resolve(p));

      await service.create({ ...dto, tagIds: [1, 2] });

      expect(mockTagRepo.findBy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('actualiza el producto', async () => {
      const product = mockProduct();
      const dto: UpdateProductDto = { name: 'iPhone 15 Pro' };
      mockProductRepo.findOne.mockResolvedValue(product);
      mockProductRepo.save.mockResolvedValue({ ...product, ...dto });

      const result = await service.update(1, dto);

      expect(result.name).toBe('iPhone 15 Pro');
    });

    it('lanza NotFoundException cuando el producto no existe', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el nuevo slug está en uso', async () => {
      mockProductRepo.findOne.mockResolvedValue(mockProduct({ slug: 'old' }));
      mockProductRepo.existsBy.mockResolvedValueOnce(true);

      await expect(service.update(1, { slug: 'taken' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('elimina el producto correctamente', async () => {
      mockProductRepo.findOne.mockResolvedValue(mockProduct());
      mockProductRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('lanza NotFoundException cuando el producto no existe', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
