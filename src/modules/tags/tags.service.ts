import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';
import { IBaseService } from '@common/interfaces/base-service.interface';

@Injectable()
export class TagsService implements IBaseService<
  Tag,
  CreateTagDto,
  UpdateTagDto
> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResponseDto<Tag>> {
    const qb = this.tagRepo
      .createQueryBuilder('tag')
      .orderBy('tag.name', 'ASC');

    if (pagination.search) {
      qb.where('LOWER(tag.name) ILIKE LOWER(:search)', {
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

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOneBy({ id });
    if (!tag) throw new NotFoundException(`Tag with id "${id}" not found`);
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const exists = await this.tagRepo.existsBy({ slug: dto.slug });
    if (exists)
      throw new ConflictException(`Tag slug "${dto.slug}" already in use`);
    return this.tagRepo.save(this.tagRepo.create(dto));
  }

  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    if (dto.slug && dto.slug !== tag.slug) {
      const exists = await this.tagRepo.existsBy({ slug: dto.slug });
      if (exists)
        throw new ConflictException(`Tag slug "${dto.slug}" already in use`);
    }
    Object.assign(tag, dto);
    return this.tagRepo.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepo.remove(tag);
  }
}
