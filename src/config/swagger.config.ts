import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription(
      `
## Public REST API for e-commerce

A fully public API to test and prototype e-commerce integrations.
No authentication required.

### Features
- Products with variants, images and tags
- Categories (with nested subcategories)
- Brands
- Reviews
- Coupons
- Orders

### Conventions
- All endpoints are prefixed with \`/${apiPrefix}\`
- Paginated responses include a \`meta\` object with pagination info
- All timestamps are ISO 8601 in UTC
- UUIDs are used as identifiers
      `.trim(),
    )
    .setVersion('1.0')
    .addTag('Categories', 'Product category hierarchy')
    .addTag('Brands', 'Product brands')
    .addTag('Products', 'Product catalog with variants and images')
    .addTag('Tags', 'Product tags')
    .addTag('Reviews', 'Product reviews')
    .addTag('Coupons', 'Discount coupons')
    .addTag('Orders', 'Customer orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'E-commerce API Docs',
  });
}
