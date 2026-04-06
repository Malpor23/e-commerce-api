import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import { IBaseService } from '@common/interfaces/base-service.interface';

@Injectable()
export class CategoriesService implements IBaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Category>> {
    const qb = this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .orderBy('category.name', 'ASC');

    if (pagination.search) {
      qb.where('LOWER(category.name) ILIKE LOWER(:search)', {
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    await this.assertSlugIsUnique(dto.slug);

    const category = this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      parent: dto.parentId ? ({ id: dto.parentId } as Category) : null,
    });

    return this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      await this.assertSlugIsUnique(dto.slug);
    }

    if (dto.parentId !== undefined) {
      category.parent = dto.parentId
        ? ({ id: dto.parentId } as Category)
        : null;
    }

    Object.assign(category, {
      name: dto.name ?? category.name,
      slug: dto.slug ?? category.slug,
      description: dto.description ?? category.description,
    });

    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }

  private async assertSlugIsUnique(slug: string): Promise<void> {
    const exists = await this.categoryRepo.existsBy({ slug });
    if (exists) {
      throw new ConflictException(
        `A category with slug "${slug}" already exists`,
      );
    }
  }
}
