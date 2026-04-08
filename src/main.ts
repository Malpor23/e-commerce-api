import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from '@config/app.config';
import { GlobalExceptionFilter } from '@common/filters';
import { LoggingInterceptor, TransformInterceptor } from '@common/interceptors';
import { setupSwagger } from '@config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const apiPrefix = appConfig?.apiPrefix ?? 'api/v1';

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Redirect root "/" to the API base path
  app.getHttpAdapter().getInstance().get('/', (_req, res) => {
    res.redirect(301, `/${apiPrefix}`);
  });

  // CORS
  app.enableCors();

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger
  if (appConfig?.swaggerEnabled) {
    setupSwagger(app, apiPrefix);
  }

  const port = appConfig?.port ?? parseInt('3000', 10);

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application running on http://localhost:${port}/${apiPrefix}`);

  if (appConfig?.swaggerEnabled) {
    logger.log(`Swagger docs at http://localhost:${port}/docs`);
  }
}

bootstrap();
