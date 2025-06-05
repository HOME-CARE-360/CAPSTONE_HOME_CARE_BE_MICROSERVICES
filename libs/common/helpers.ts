
import { Prisma, WeekDay } from '@prisma/client';
import { randomInt } from 'crypto'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ZodError } from 'zod';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
// Type Predicate
export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function isForeignKeyConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}

export const generateOTP = () => {
    return String(randomInt(100000, 1000000))
}

export const generateRandomFilename = (filename: string) => {
    const ext = path.extname(filename)
    return `${uuidv4()}${ext}`
}

export const generateCancelPaymentJobId = (paymentId: number) => {
    return `paymentId-${paymentId}`
}

export const generateRoomUserId = (userId: number) => {
    return `userId-${userId}`
}
export const toMinutes = (time: string): number => {
    const [hour, minute] = time.split(':').map(Number)
    return hour * 60 + minute
}
export const adjustDateToWeekday = (startDate: Date, day: WeekDay): Date => {
    const dayMap = {
        MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
        THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
    };

    const targetDay = dayMap[day];
    const current = startDate.getDay();
    const diff = (targetDay + 7 - current) % 7;
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + diff);
    return result;
}




export function forwardRpcException(error: any, isRpc = false): never {
    console.log(error);
    console.log(error.response.message);

    if (error instanceof ZodError) {
        console.log("ok r");

        const formatted = error.errors.map((e) => ({
            message: e.message,
            path: e.path.join('.'),
        }));

        if (isRpc) {
            throw new RpcException(
                new BadRequestException({ message: formatted, statusCode: 400 })
            );
        }

        throw new BadRequestException({ message: formatted });
    }

    if (isRpc) {
        throw new RpcException('Internal server error');
    }

    throw new BadRequestException('Internal server error');
}
