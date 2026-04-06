import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@modules/categories/entities/category.entity';
import { CATEGORY_SEED } from '../data/categories.data';

@Injectable()
export class CategorySeeder {
  private readonly logger = new Logger(CategorySeeder.name);

  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async run(): Promise<Map<string, Category>> {
    const map = new Map<string, Category>();

    const roots = CATEGORY_SEED.filter((c) => !c.parentSlug);
    for (const data of roots) {
      const existing = await this.repo.findOneBy({ slug: data.slug });
      if (existing) {
        map.set(data.slug, existing);
        continue;
      }
      const category = this.repo.create({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent: null,
      });
      const saved = await this.repo.save(category);
      map.set(saved.slug, saved);
      this.logger.log(`Category: ${saved.name}`);
    }

    const children = CATEGORY_SEED.filter((c) => c.parentSlug);
    for (const data of children) {
      const existing = await this.repo.findOneBy({ slug: data.slug });
      if (existing) {
        map.set(data.slug, existing);
        continue;
      }
      const parent = map.get(data.parentSlug!);
      const category = this.repo.create({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent: parent ?? null,
      });
      const saved = await this.repo.save(category);
      map.set(saved.slug, saved);
      this.logger.log(`Category: ${saved.name} (parent: ${data.parentSlug})`);
    }

    return map;
  }
}
