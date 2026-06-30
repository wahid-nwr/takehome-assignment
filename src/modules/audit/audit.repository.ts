import { Prisma, PrismaClient } from "@prisma/client";
import { AuditLogRequest } from "./dto/audit-log-request";
export class AuditRepository {

constructor(
        private readonly prisma: PrismaClient
    ) {}

    async insert(params: AuditLogRequest): Promise<void> {
        await this.prisma.flagAuditLog.create({
            data: {
                tenantId: params.tenantId,
                flagId: params.flagId,
                action: params.action,
                previousValue: params.previousValue as Prisma.InputJsonValue,
                newValue: params.newValue as Prisma.InputJsonValue,
                changedBy: params.changedBy
            }
        });
    }

    async getHistory(
        tenantId: string,
        flagId: string
    ) {
        return this.prisma.flagAuditLog.findMany({
            where: {
                tenantId,
                flagId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
}