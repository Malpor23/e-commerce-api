import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';

export interface WelcomeResponse {
  message: string;
  version: string;
  docs: string;
}

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getWelcome(): WelcomeResponse {
    const appConfig = this.configService.get<AppConfig>('app');
    const port = appConfig?.port ?? 3000;
    const docsUrl = `http://localhost:${port}/docs`;

    return {
      message: 'Welcome to the E-commerce API',
      version: '1.0',
      docs: docsUrl,
    };
  }
}
