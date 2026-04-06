import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';
import { ProductImage } from '@modules/products/entities/product-image.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Brand } from '@modules/brands/entities/brand.entity';
import { Tag } from '@modules/tags/entities/tag.entity';
import { PRODUCT_SEED } from '../data/products.data';

@Injectable()
export class ProductSeeder {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async run(
    categoryMap: Map<string, Category>,
    brandMap: Map<string, Brand>,
    tagMap: Map<string, Tag>,
  ): Promise<Map<string, Product>> {
    const map = new Map<string, Product>();

    for (const data of PRODUCT_SEED) {
      const existing = await this.productRepo.findOneBy({ slug: data.slug });
      if (existing) {
        map.set(data.slug, existing);
        this.logger.log(`Product already exists: ${data.name}`);
        continue;
      }

      const category = categoryMap.get(data.categorySlug) ?? null;
      const brand = brandMap.get(data.brandSlug) ?? null;
      const tags = data.tagSlugs
        .map((s) => tagMap.get(s))
        .filter(Boolean) as Tag[];

      if (!category)
        this.logger.warn(`Category not found: ${data.categorySlug}`);
      if (!brand) this.logger.warn(`Brand not found: ${data.brandSlug}`);

      const images = data.images.map((img) =>
        this.imageRepo.create({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        }),
      );

      const variants = data.variants.map((v) =>
        this.variantRepo.create({
          name: v.name,
          sku: v.sku,
          price: v.price ?? null,
          stock: v.stock,
          attributes: v.attributes,
        }),
      );

      const product = this.productRepo.create({
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        sku: data.sku,
        stock: data.stock,
        isActive: data.isActive,
        category,
        brand,
        tags,
        images,
        variants,
      });

      const saved = await this.productRepo.save(product);
      map.set(saved.slug, saved);
      this.logger.log(
        `Product: ${saved.name} — ${images.length} images, ${variants.length} variants`,
      );
    }

    return map;
  }
}
