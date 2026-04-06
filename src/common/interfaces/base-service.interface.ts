import { PaginationDto, PaginatedResponseDto } from '@common/dto';

export interface IBaseService<TEntity, TCreate, TUpdate> {
  findAll(pagination: PaginationDto): Promise<PaginatedResponseDto<TEntity>>;
  findOne(id: number): Promise<TEntity>;
  create(dto: TCreate): Promise<TEntity>;
  update(id: number, dto: TUpdate): Promise<TEntity>;
  remove(id: number): Promise<void>;
}
