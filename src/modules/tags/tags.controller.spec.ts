import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import type { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@common/dto/api-response.dto';
import type { Tag } from './entities/tag.entity';

const mockTag = (): Tag => ({ id: 1, name: 'wireless', slug: 'wireless' }) as Tag;

describe('TagsController', () => {
  let controller: TagsController;
  let service: jest.Mocked<TagsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
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

    controller = module.get<TagsController>(TagsController);
    service = module.get(TagsService);
  });

  it('findAll — delega a TagsService.findAll', async () => {
    const paginated = new PaginatedResponseDto([mockTag()], new PaginationMetaDto(1, 10, 1));
    service.findAll.mockResolvedValue(paginated);

    const pagination = new PaginationDto();
    const result = await controller.findAll(pagination);

    expect(service.findAll).toHaveBeenCalledWith(pagination);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a TagsService.findOne con el id correcto', async () => {
    const tag = mockTag();
    service.findOne.mockResolvedValue(tag);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(tag);
  });

  it('create — delega a TagsService.create con el DTO', async () => {
    const dto: CreateTagDto = { name: 'wireless', slug: 'wireless' };
    const tag = mockTag();
    service.create.mockResolvedValue(tag);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(tag);
  });

  it('update — delega a TagsService.update con id y DTO', async () => {
    const dto: UpdateTagDto = { name: 'Wireless' };
    const tag = mockTag();
    service.update.mockResolvedValue(tag);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(tag);
  });

  it('remove — delega a TagsService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
