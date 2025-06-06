import { Module } from '@nestjs/common'
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { CommonModule } from 'libs/common/src';


@Module({
  providers: [MediaService,],
  imports: [
    ConfigModule, CommonModule
  ],
  controllers: [MediaController],
})
export class MediaModule {
}
