import { NotFoundException, UnprocessableEntityException, BadRequestException } from '@nestjs/common';

export const ServiceProviderNotFoundException = new NotFoundException([
    {
        message: 'Error.ServiceProviderNotFound',
        path: ['id'],
    },
]);

export const ServiceProviderAlreadyExistsException = new UnprocessableEntityException([
    {
        message: 'Error.ServiceProviderAlreadyExists',
        path: ['taxId', 'name'],
    },
]);

export const SameVerificationStatusException = new BadRequestException([
    {
        message: 'Error.SameVerificationStatus',
        path: ['verificationStatus'],
    },
]);

export const InvalidCompanyTypeException = new BadRequestException([
    {
        message: 'Error.InvalidCompanyType',
        path: ['companyType'],
    },
]);

export const UserAlreadyLinkedToProviderException = new UnprocessableEntityException([
    {
        message: 'Error.UserAlreadyLinkedToProvider',
        path: ['userId'],
    },
]);
