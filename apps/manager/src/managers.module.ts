import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagerRepository } from './managers.repo';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';

@Module({
  imports: [CommonModule, ConfigModule],
  controllers: [ManagersController],
  providers: [ManagersService, ManagerRepository],
})
export class ManagersModule { }
