import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '@modules/brands/entities/brand.entity';
import { BRAND_SEED } from '../data/brands.data';

@Injectable()
export class BrandSeeder {
  private readonly logger = new Logger(BrandSeeder.name);

  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  async run(): Promise<Map<string, Brand>> {
    const map = new Map<string, Brand>();

    for (const data of BRAND_SEED) {
      const existing = await this.repo.findOneBy({ slug: data.slug });
      if (existing) {
        map.set(data.slug, existing);
        continue;
      }
      const brand = this.repo.create(data);
      const saved = await this.repo.save(brand);
      map.set(saved.slug, saved);
      this.logger.log(`Brand: ${saved.name}`);
    }

    return map;
  }
}
