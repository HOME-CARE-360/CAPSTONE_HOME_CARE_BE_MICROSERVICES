import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'

import mime from 'mime-types'
import envConfig from './config'

@Injectable()
export class S3Service {
    private s3: S3
    constructor() {
        this.s3 = new S3({
            endpoint: envConfig.S3_ENPOINT,
            region: envConfig.S3_REGION,
            forcePathStyle: true,
            credentials: {
                secretAccessKey: envConfig.S3_SECRET_KEY,
                accessKeyId: envConfig.S3_ACCESS_KEY,

            },
        })
    }
    createPresignedUrlWithClient(filename: string) {
        const contentType = mime.lookup(filename) || 'application/octet-stream'


        const command = new PutObjectCommand({ Bucket: envConfig.S3_BUCKET_NAME, Key: filename, ContentType: contentType ,})
        try {
            getSignedUrl(this.s3, command, { expiresIn: 10 })

        } catch (error) {
            console.log(error);

        }
        return getSignedUrl(this.s3, command, { expiresIn: 10 })



    }
}