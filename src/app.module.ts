import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig, { AppConfig } from '@config/app.config';
import databaseConfig from '@config/database.config';
import { envValidationSchema } from '@config/env.validation';
import { DatabaseModule } from '@config/database.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { BrandsModule } from '@modules/brands/brands.module';
import { ProductsModule } from '@modules/products/products.module';
import { TagsModule } from '@modules/tags/tags.module';
import { ReviewsModule } from '@modules/reviews/reviews.module';
import { CouponsModule } from '@modules/coupons/coupons.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { SeederModule } from '@/database/seeders/seeder.module';
import { SeederService } from '@/database/seeders/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true },
    }),

    DatabaseModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    TagsModule,
    ReviewsModule,
    CouponsModule,
    OrdersModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly seederService: SeederService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const appConfig = this.configService.get<AppConfig>('app');
    const nodeEnv = appConfig?.nodeEnv;
    if (nodeEnv === 'development') {
      this.logger.log('Development mode — running seeders…');
      await this.seederService.seed();
    }
  }
}
