import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import type { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

const mockTag = (overrides: Partial<Tag> = {}): Tag =>
  ({ id: 1, name: 'wireless', slug: 'wireless', products: [], ...overrides }) as Tag;

const buildQb = (data: Tag[] = [], total = 0) => ({
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, total]),
});

describe('TagsService', () => {
  let service: TagsService;

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
        TagsService,
        { provide: getRepositoryToken(Tag), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna resultado paginado', async () => {
      const qb = buildQb([mockTag()], 1);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), { page: 1, limit: 10 });
      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('aplica búsqueda cuando se provee search', async () => {
      const qb = buildQb([], 0);
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      const pagination = Object.assign(new PaginationDto(), { page: 1, limit: 10, search: 'wire' });
      await service.findAll(pagination);

      expect(qb.where).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%wire%' }),
      );
    });
  });

  describe('findOne', () => {
    it('retorna el tag cuando existe', async () => {
      const tag = mockTag();
      mockRepo.findOneBy.mockResolvedValue(tag);

      expect(await service.findOne(1)).toEqual(tag);
    });

    it('lanza NotFoundException cuando no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateTagDto = { name: 'wireless', slug: 'wireless' };

    it('crea y retorna el tag', async () => {
      const tag = mockTag();
      mockRepo.existsBy.mockResolvedValue(false);
      mockRepo.create.mockReturnValue(tag);
      mockRepo.save.mockResolvedValue(tag);

      expect(await service.create(dto)).toEqual(tag);
    });

    it('lanza ConflictException si el slug ya está en uso', async () => {
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('actualiza y retorna el tag', async () => {
      const tag = mockTag();
      const dto: UpdateTagDto = { name: 'Wireless' };
      mockRepo.findOneBy.mockResolvedValue(tag);
      mockRepo.save.mockResolvedValue({ ...tag, ...dto });

      const result = await service.update(1, dto);

      expect(result.name).toBe('Wireless');
    });

    it('lanza NotFoundException cuando el tag no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el nuevo slug está en uso', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTag({ slug: 'old' }));
      mockRepo.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { slug: 'taken' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('elimina el tag correctamente', async () => {
      const tag = mockTag();
      mockRepo.findOneBy.mockResolvedValue(tag);
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('lanza NotFoundException cuando el tag no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
