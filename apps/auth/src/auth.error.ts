import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const InvalidOTPException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.InvalidOTP', path: 'code' },
    ])
);

export const OTPExpiredException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.OTPExpired', path: 'code' },
    ])
);

export const FailedToSendOTPException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.FailedToSendOTP', path: 'code' },
    ])
);

export const RefreshTokenRevokedException = new RpcException(
    new UnauthorizedException({
        message: 'Error.RefreshTokenRevoked',
        path: 'refreshToken',
    })
);
export const EmailAlreadyExistsException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.EmailAlreadyExists', path: 'email' },
    ])
);

export const ServiceProviderAlreadyExistsException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.ServiceProviderAlreadyExists', path: ['taxId', 'name'] },
    ])
);

export const InvalidPasswordException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.InvalidPassword', path: 'password' },
    ])
);

export const EmailNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.EmailNotFound', path: 'email' },
    ])
);

export const RefreshTokenAlreadyUsedException = new RpcException(
    new UnauthorizedException('Error.RefreshTokenAlreadyUsed')
);

export const UnauthorizedAccessException = new RpcException(
    new UnauthorizedException('Error.UnauthorizedAccess')
);

export const GoogleUserInfoError = new RpcException(
    new Error('Error.FailedToGetGoogleUserInfo')
);

export const InvalidTOTPException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.InvalidTOTP', path: 'totpCode' },
    ])
);

export const TOTPAlreadyEnabledException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.TOTPAlreadyEnabled', path: 'totpCode' },
    ])
);

export const TOTPNotEnabledException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.TOTPNotEnabled', path: 'totpCode' },
    ])
);

export const InvalidTOTPAndCodeException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.InvalidTOTPAndCode', path: 'totpCode' },
        { message: 'Error.InvalidTOTPAndCode', path: 'code' },
    ])
);
