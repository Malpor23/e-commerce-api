import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';
import { AppService } from './app.service';
import type { WelcomeResponse } from './app.service';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome', description: 'Retorna un mensaje de bienvenida y un enlace a la documentación de Swagger.' })
  @ApiOkResponse({ description: 'Link a la documentación de la API.' })
  getWelcome(@Req() req: Request): WelcomeResponse {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.appService.getWelcome(baseUrl);
  }
}
