import { Test, TestingModule } from '@nestjs/testing';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';

describe('ProviderController', () => {
  let providerController: ProviderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProviderController],
      providers: [ProviderService],
    }).compile();

    providerController = app.get<ProviderController>(ProviderController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(providerController.getHello()).toBe('Hello World!');
    });
  });
});
