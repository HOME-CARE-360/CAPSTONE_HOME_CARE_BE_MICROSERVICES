import { Body, Controller, Post, } from '@nestjs/common';
import { MediaService } from './media.service';


import { PresignedUploadFileBodyDTO } from './media.dto';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }
  @IsPublic()
  @Post('images/upload/presigned-url')
  @IsPublic()
  async createPresignedUrl(@Body() body: PresignedUploadFileBodyDTO) {
    return await this.mediaService.getPresignUrl(body)
  }

}
