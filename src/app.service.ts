import { Injectable } from '@nestjs/common';

export interface WelcomeResponse {
  message: string;
  version: string;
  docs: string;
}

@Injectable()
export class AppService {
  getWelcome(baseUrl: string): WelcomeResponse {
    return {
      message: 'Welcome to the E-commerce API',
      version: '1.0',
      docs: `${baseUrl}/docs`,
    };
  }
}
