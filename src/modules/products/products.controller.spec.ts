import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import type { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@common/dto/api-response.dto';
import type { Product } from './entities/product.entity';

const mockProduct = (): Product => ({ id: 1, name: 'iPhone 15', slug: 'iphone-15' }) as Product;

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
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

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService);
  });

  it('findAll — delega a ProductsService.findAll', async () => {
    const paginated = new PaginatedResponseDto([mockProduct()], new PaginationMetaDto(1, 10, 1));
    service.findAll.mockResolvedValue(paginated);

    const filter = Object.assign(new PaginationDto(), {}) as any;
    const result = await controller.findAll(filter);

    expect(service.findAll).toHaveBeenCalledWith(filter);
    expect(result).toBe(paginated);
  });

  it('findOne — delega a ProductsService.findOne', async () => {
    const product = mockProduct();
    service.findOne.mockResolvedValue(product);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBe(product);
  });

  it('create — delega a ProductsService.create', async () => {
    const dto: CreateProductDto = {
      name: 'iPhone 15',
      slug: 'iphone-15',
      basePrice: 999,
      sku: 'APPL-IP15',
    };
    const product = mockProduct();
    service.create.mockResolvedValue(product);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(product);
  });

  it('update — delega a ProductsService.update', async () => {
    const dto: UpdateProductDto = { name: 'iPhone 15 Pro' };
    const product = mockProduct();
    service.update.mockResolvedValue(product);

    const result = await controller.update(1, dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(product);
  });

  it('remove — delega a ProductsService.remove', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
