import { UnauthorizedException } from '@nestjs/common';
import { app } from './app';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { AUTH_SERVICE } from 'libs/common/src/constants/service-name.constant';

export const authContext = async ({ req }) => {
    try {
        const authClient = app.get<ClientProxy>(AUTH_SERVICE);
        const user = await lastValueFrom(
            authClient.send('authenticate', {
                Authentication: req.headers?.authentication,
            }),
        );
        return { user };
    } catch (err) {
        throw new UnauthorizedException(err);
    }
};