import { Controller, Body, Patch, OnModuleInit, Inject, Get } from '@nestjs/common';
import { ManagersService } from './managers.service';

import { ZodSerializerDto } from 'nestjs-zod';
import { UpdateStatusProviderBodyDTO } from './managers.dto';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'libs/common/src/types/auth';
import { ClientGrpc } from '@nestjs/microservices';


@Controller('managers')
export class ManagersController implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(private readonly managersService: ManagersService, @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) { }
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(
      AUTH_SERVICE_NAME,
    );
  }
  @Patch("change-status-provider")
  @ZodSerializerDto(MessageResDTO)
  async updateStatusProvider(@Body() body: UpdateStatusProviderBodyDTO, @ActiveUser("userId") id: number) {
    return this.managersService.updateProviderStatus(body, id)
  }
  @Get("")
  @ZodSerializerDto(MessageResDTO)
  authTest() {
    this.authService.authenticate({ accessToken: "hihi" })
    return {
      message: "thanh cong"
    }
  }
}
