import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderService {
  getHello(): string {
    return 'Hello World!';
  }
}
