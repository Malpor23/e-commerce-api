import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import {
  CreateProductDto,
  ProductFilterDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Tag } from '@modules/tags/entities/tag.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Brand } from '@modules/brands/entities/brand.entity';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(
    filter: ProductFilterDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.tags', 'tags')
      .orderBy('product.createdAt', 'DESC');

    if (filter.search) {
      qb.andWhere(
        '(LOWER(product.name) ILIKE LOWER(:search) OR LOWER(product.sku) ILIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }
    if (filter.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: filter.categoryId,
      });
    }
    if (filter.brandId) {
      qb.andWhere('brand.id = :brandId', { brandId: filter.brandId });
    }
    if (filter.minPrice !== undefined) {
      qb.andWhere('product.basePrice >= :minPrice', {
        minPrice: filter.minPrice,
      });
    }
    if (filter.maxPrice !== undefined) {
      qb.andWhere('product.basePrice <= :maxPrice', {
        maxPrice: filter.maxPrice,
      });
    }
    if (filter.isActive !== undefined) {
      qb.andWhere('product.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    const [data, total] = await qb
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(filter.page, filter.limit, total),
    );
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        brand: true,
        images: true,
        variants: true,
        tags: true,
        reviews: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.assertSlugIsUnique(dto.slug);
    await this.assertSkuIsUnique(dto.sku);

    const product = this.productRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      basePrice: dto.basePrice,
      sku: dto.sku,
      stock: dto.stock ?? 0,
      isActive: dto.isActive ?? true,
      category: dto.categoryId
        ? ({ id: dto.categoryId } as unknown as Category)
        : null,
      brand: dto.brandId ? ({ id: dto.brandId } as unknown as Brand) : null,
      images:
        dto.images?.map((img) => Object.assign(new ProductImage(), img)) ?? [],
      variants:
        dto.variants?.map((v) => Object.assign(new ProductVariant(), v)) ?? [],
    });

    if (dto.tagIds?.length) {
      product.tags = await this.resolveTagsByIds(dto.tagIds);
    }

    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.slug && dto.slug !== product.slug) {
      await this.assertSlugIsUnique(dto.slug);
    }
    if (dto.sku && dto.sku !== product.sku) {
      await this.assertSkuIsUnique(dto.sku);
    }

    Object.assign(product, {
      name: dto.name ?? product.name,
      slug: dto.slug ?? product.slug,
      description: dto.description ?? product.description,
      basePrice: dto.basePrice ?? product.basePrice,
      sku: dto.sku ?? product.sku,
      stock: dto.stock ?? product.stock,
      isActive: dto.isActive ?? product.isActive,
      category:
        dto.categoryId !== undefined
          ? dto.categoryId
            ? ({ id: dto.categoryId } as unknown as Category)
            : null
          : product.category,
      brand:
        dto.brandId !== undefined
          ? dto.brandId
            ? ({ id: dto.brandId } as unknown as Brand)
            : null
          : product.brand,
    });

    if (dto.tagIds) {
      product.tags = await this.resolveTagsByIds(dto.tagIds);
    }

    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  private async resolveTagsByIds(ids: number[]): Promise<Tag[]> {
    if (!ids.length) return [];
    return this.tagRepo.findBy({ id: In(ids) });
  }

  private async assertSlugIsUnique(slug: string): Promise<void> {
    const exists = await this.productRepo.existsBy({ slug });
    if (exists) {
      throw new ConflictException(
        `A product with slug "${slug}" already exists`,
      );
    }
  }

  private async assertSkuIsUnique(sku: string): Promise<void> {
    const exists = await this.productRepo.existsBy({ sku });
    if (exists) {
      throw new ConflictException(`A product with SKU "${sku}" already exists`);
    }
  }
}
