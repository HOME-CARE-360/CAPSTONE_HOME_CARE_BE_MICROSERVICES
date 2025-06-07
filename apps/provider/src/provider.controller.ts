import { Controller, Get } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller()
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  getHello(): string {
    return this.providerService.getHello();
  }
}
