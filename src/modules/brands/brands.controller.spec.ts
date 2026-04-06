import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import type { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import type { Brand } from './entities/brand.entity';

const mockBrand = (): Brand =>
  ({ id: 1, name: 'Apple', slug: 'apple' }) as Brand;

const mockPaginated = (data: Brand[]): PaginatedResponseDto<Brand> =>
  new PaginatedResponseDto(data, new PaginationMetaDto(1, 10, data.length));

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: jest.Mocked<BrandsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
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

    controller = module.get<BrandsController>(BrandsController);
    service = module.get(BrandsService);
  });

  it('findAll — delega a BrandsService.findAll y retorna el resultado', async () => {
    const paginated = mockPaginated([mockBrand()]);
    service.findAll.mockResolvedValue(paginated);

    const pagination = new PaginationDto();
    const result = await controller.findAll(pagination);

    expect(service.findAll).toHaveBeenCalledWith(pagination);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a BrandsService.findOne con el id correcto', async () => {
    const brand = mockBrand();
    service.findOne.mockResolvedValue(brand);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(brand);
  });

  it('create — delega a BrandsService.create con el DTO correcto', async () => {
    const dto: CreateBrandDto = { name: 'Apple', slug: 'apple' };
    const brand = mockBrand();
    service.create.mockResolvedValue(brand);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(brand);
  });

  it('update — delega a BrandsService.update con id y DTO correctos', async () => {
    const dto: UpdateBrandDto = { name: 'Apple Inc.' };
    const brand = mockBrand();
    service.update.mockResolvedValue(brand);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(brand);
  });

  it('remove — delega a BrandsService.remove con el id correcto', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
