import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@/app.service';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let appService: AppService;

  const buildModule = async (
    configReturnValue: unknown,
  ): Promise<TestingModule> =>
    Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(configReturnValue) },
        },
      ],
    }).compile();

  describe('con puerto configurado', () => {
    beforeEach(async () => {
      const module = await buildModule({ port: 4000 });
      appService = module.get<AppService>(AppService);
    });

    it('debería construir la URL de docs con el puerto de la configuración', () => {
      const result = appService.getWelcome();

      expect(result.docs).toBe('http://localhost:4000/docs');
    });
  });

  describe('sin configuración (valores por defecto)', () => {
    beforeEach(async () => {
      const module = await buildModule(undefined);
      appService = module.get<AppService>(AppService);
    });

    it('debería usar el puerto 3000 por defecto cuando no hay configuración', () => {
      const result = appService.getWelcome();

      expect(result.docs).toBe('http://localhost:3000/docs');
    });

    it('debería retornar siempre message, version y docs', () => {
      const result = appService.getWelcome();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('docs');
    });
  });
});
