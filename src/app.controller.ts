import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { WelcomeResponse } from './app.service';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome', description: 'Returns a welcome message and a link to the Swagger documentation.' })
  @ApiOkResponse({ description: 'API information and docs link.' })
  getWelcome(): WelcomeResponse {
    return this.appService.getWelcome();
  }
}
