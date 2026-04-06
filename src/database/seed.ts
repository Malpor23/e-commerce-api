import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import { envValidationSchema } from '@config/env.validation';
import { DatabaseModule } from '@config/database.module';
import { SeederModule } from './seeders/seeder.module';
import { SeederService } from './seeders/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    SeederModule,
  ],
})
class SeederAppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeederAppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const seederService = app.get(SeederService);
    await seederService.seed();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
