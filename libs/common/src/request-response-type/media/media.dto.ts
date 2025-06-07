import { createZodDto } from 'nestjs-zod'
import {
    PresignedUploadFileBodySchema,

} from 'src/routes/media/media.model'

export class PresignedUploadFileBodyDTO extends createZodDto(PresignedUploadFileBodySchema) { }

