import { Injectable } from '@nestjs/common'

import { PresignedUploadFileBodyType } from '../../../libs/common/src/request-response-type/media/media.model'
import { S3Service } from 'libs/common/src/services/S3.service'
import { generateRandomFilename } from 'libs/common/helpers'

@Injectable()
export class MediaService {
    constructor(private readonly s3Service: S3Service) { }


    async getPresignUrl(body: PresignedUploadFileBodyType) {
        const randomFilename = generateRandomFilename(body.filename)
        const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFilename)
        const url = presignedUrl.split('?')[0]
        return {
            presignedUrl,
            url,
        }
    }
}