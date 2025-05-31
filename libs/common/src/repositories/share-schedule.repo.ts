import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { StaffShiftAssignmentSchema } from "../models/shared-staff-shift-assignment.model"
import { z } from "zod"
type StaffShiftAssignmentBody = z.infer<typeof StaffShiftAssignmentSchema>
@Injectable()
export class SharedScheduleRepository {

    constructor(private readonly prismaService: PrismaService) { }
    async findUnique(input: Pick<StaffShiftAssignmentBody, "shiftTemplateId" | "effectiveFrom"
        | "staffId">) {
        const existing = await this.prismaService.staffShiftAssignment.findUnique({
            where: {
                staffId_shiftTemplateId_effectiveFrom: {
                    staffId: input.staffId,
                    shiftTemplateId: input.shiftTemplateId,
                    effectiveFrom: input.effectiveFrom,
                }
            }
        })
        return existing
    }


}