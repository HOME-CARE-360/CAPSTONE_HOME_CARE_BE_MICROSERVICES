import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagerRepository } from './managers.repo';

@Module({
  controllers: [ManagersController],
  providers: [ManagersService, ManagerRepository],
})
export class ManagersModule { }
