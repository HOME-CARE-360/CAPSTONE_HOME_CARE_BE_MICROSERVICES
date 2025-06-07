import { Body, Controller, } from '@nestjs/common';
import { MediaService } from './media.service';


import { PresignedUploadFileBodyDTO } from '../../../libs/common/src/request-response-type/media/media.dto';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }
  @IsPublic()
  @MessagePattern("images/upload/presigned-url")
  async createPresignedUrl(@Body() body: PresignedUploadFileBodyDTO) {
    return await this.mediaService.getPresignUrl(body)
  }
}
