import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '@modules/tags/entities/tag.entity';
import { TAG_SEED } from '../data/tags.data';

@Injectable()
export class TagSeeder {
  private readonly logger = new Logger(TagSeeder.name);

  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async run(): Promise<Map<string, Tag>> {
    const map = new Map<string, Tag>();

    for (const data of TAG_SEED) {
      const existing = await this.repo.findOneBy({ slug: data.slug });
      if (existing) {
        map.set(data.slug, existing);
        continue;
      }
      const tag = this.repo.create(data);
      const saved = await this.repo.save(tag);
      map.set(saved.slug, saved);
      this.logger.log(`Tag: ${saved.name}`);
    }

    return map;
  }
}
