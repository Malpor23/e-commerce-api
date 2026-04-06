import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { WelcomeResponse } from './app.service';

const MOCK_WELCOME: WelcomeResponse = {
  message: 'Welcome to the E-commerce API',
  version: '1.0',
  docs: 'http://localhost:3000/docs',
};

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getWelcome: jest.fn().mockReturnValue(MOCK_WELCOME),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getWelcome', () => {
    it('debería retornar un objeto con message, version y docs', () => {
      const result = appController.getWelcome();

      expect(result).toEqual(MOCK_WELCOME);
    });

    it('debería delegar la llamada a AppService.getWelcome()', () => {
      appController.getWelcome();

      expect(appService.getWelcome()).toHaveBeenCalledTimes(1);
    });

    it('debería retornar la propiedad message correcta', () => {
      const { message } = appController.getWelcome();

      expect(message).toBe('Welcome to the E-commerce API');
    });

    it('debería retornar la versión "1.0"', () => {
      const { version } = appController.getWelcome();

      expect(version).toBe('1.0');
    });

    it('debería retornar una URL válida en docs', () => {
      const { docs } = appController.getWelcome();

      expect(docs).toMatch(/^https?:\/\/.+\/docs$/);
    });
  });
});
