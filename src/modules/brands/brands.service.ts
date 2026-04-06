import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import { IBaseService } from '@common/interfaces/base-service.interface';

@Injectable()
export class BrandsService implements IBaseService<
  Brand,
  CreateBrandDto,
  UpdateBrandDto
> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Brand>> {
    const qb = this.brandRepo
      .createQueryBuilder('brand')
      .orderBy('brand.name', 'ASC');

    if (pagination.search) {
      qb.where('LOWER(brand.name) ILIKE LOWER(:search)', {
        search: `%${pagination.search}%`,
      });
    }

    const [data, total] = await qb
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(pagination.page, pagination.limit, total),
    );
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException(`Brand with id "${id}" not found`);
    return brand;
  }

  async create(dto: CreateBrandDto): Promise<Brand> {
    await this.assertSlugIsUnique(dto.slug);
    const brand = this.brandRepo.create(dto);
    return this.brandRepo.save(brand);
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    if (dto.slug && dto.slug !== brand.slug) {
      await this.assertSlugIsUnique(dto.slug);
    }
    Object.assign(brand, dto);
    return this.brandRepo.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandRepo.remove(brand);
  }

  private async assertSlugIsUnique(slug: string): Promise<void> {
    const exists = await this.brandRepo.existsBy({ slug });
    if (exists)
      throw new ConflictException(`A brand with slug "${slug}" already exists`);
  }
}
