import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription(
      `
## API REST para e-commerce

Una API completamente pública para probar y prototipar integraciones de e-commerce.
No requiere autenticación.

### Funcionalidades
- Productos con variantes, imágenes y etiquetas
- Categorías (con subcategorías anidadas)
- Marcas
- Reseñas
- Cupones
- Pedidos

### Convenciones
- Todos los endpoints tienen el prefijo \`/${apiPrefix}\`
- Las respuestas paginadas incluyen un objeto \`meta\` con información de paginación
      `.trim(),
    )
    .setVersion('1.0')
    .addTag('Categories', 'Jerarquía de categorías de productos')
    .addTag('Brands', 'Marcas de productos')
    .addTag('Products', 'Catálogo de productos con variantes e imágenes')
    .addTag('Tags', '(Tag) Etiquetas de productos')
    .addTag('Reviews', 'Reseñas de productos')
    .addTag('Coupons', 'Cupones de descuento')
    .addTag('Orders', 'Pedidos de clientes')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const SWAGGER_UI_VERSION = '5.31.0';
  const CDN = `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}`;

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Documentación API E-commerce',
    customCssUrl: `${CDN}/swagger-ui.css`,
    customJs: [
      `${CDN}/swagger-ui-bundle.js`,
      `${CDN}/swagger-ui-standalone-preset.js`,
    ],
    customfavIcon: `${CDN}/favicon-32x32.png`,
  });
}
