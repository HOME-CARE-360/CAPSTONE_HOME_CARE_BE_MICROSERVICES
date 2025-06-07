import { Controller, Body } from '@nestjs/common';
import { ManagersService } from './managers.service';

import { ZodSerializerDto } from 'nestjs-zod';
import { UpdateStatusProviderBodyDTO } from 'libs/common/src/request-response-type/manager/managers.dto';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

@ApiBearerAuth()
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) { }
  @MessagePattern({ cmd: 'change-status-provider' })
  @ZodSerializerDto(MessageResDTO)
  async updateStatusProvider(@Body() body: UpdateStatusProviderBodyDTO, @ActiveUser("userId") id: number) {
    return this.managersService.updateProviderStatus(body, id)
  }


}
