import { PrismaClient, AuditAction } from "@prisma/client";

export class AuditRepository {

constructor(
        private readonly prisma: PrismaClient
    ) {}

    async insert(data: {
        tenantId: string;
        flagId: string;
        action: AuditAction;
        previousValue?: any;
        newValue?: any;
        changedBy?: string;
    }) {

        return this.prisma.flagAuditLog.create({
            data: {
                tenantId: data.tenantId,
                flagId: data.flagId,
                action: data.action,
                previousValue: data.previousValue,
                newValue: data.newValue,
                changedBy: data.changedBy
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