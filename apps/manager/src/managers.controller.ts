import { Controller, Body, Patch } from '@nestjs/common';
import { ManagersService } from './managers.service';

import { ZodSerializerDto } from 'nestjs-zod';
import { UpdateStatusProviderBodyDTO } from './managers.dto';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';


@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) { }

  @Patch("change-status-provider")
  @ZodSerializerDto(MessageResDTO)
  async updateStatusProvider(@Body() body: UpdateStatusProviderBodyDTO, @ActiveUser("userId") id: number) {
    return this.managersService.updateProviderStatus(body, id)
  }
}
