import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateStatusProviderBodyDTO } from "libs/common/src/request-response-type/manager/managers.dto";
import { handleZodError } from "libs/common/helpers";
import { MANAGER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";

@Controller('managers')
export class ManagerGatewayController {
    constructor(
        @Inject(MANAGER_SERVICE) private readonly authClient: ClientProxy
    ) { }
    @Post('change-status-provider')
    @ZodSerializerDto(MessageResDTO)
    async changeStatusProvider(@Body() body: UpdateStatusProviderBodyDTO) {
        try {
            return await lastValueFrom(this.authClient.send({ cmd: 'change-status-provider' }, body));
        } catch (error) {
            console.log(error);
            handleZodError(error)


        }

    }
}