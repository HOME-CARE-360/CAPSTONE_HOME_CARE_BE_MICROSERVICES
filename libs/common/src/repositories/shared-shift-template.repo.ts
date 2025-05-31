import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class ShareShiftTemplateRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUniqueShiftTemplate(id: number, providerId: number) {
        return await this.prismaService.workShiftTemplate.findUnique({
            where: {
                id: id,
                providerId
            }
        })
    }
    async findAllShiftFromProvider({ providerId }: { providerId: number }) {
        const shiftTemplates = await this.prismaService.workShiftTemplate.findMany({
            where: { providerId },
            include: {
                categoryRequirements: {
                    include: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }

            }
        });
        return shiftTemplates
    }
}