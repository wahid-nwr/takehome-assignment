import {
    Environment,
    Prisma,
    PrismaClient
} from "@prisma/client";
export class FlagRepository {

constructor(
        private prisma: PrismaClient
    ) {}

    async create(data: Prisma.FeatureFlagUncheckedCreateInput) {
        return this.prisma.featureFlag.create({
            data
        });
    }

    async findById(
        tenantId: string,
        flagId: string
    ) {
        return this.prisma.featureFlag.findFirst({
            where: {
                id: flagId,
                tenantId
            }
        });
    }

    async findByKey(
        tenantId: string,
        key: string,
        environment?: Environment,
        includeArchived = false
    ) {
        return this.prisma.featureFlag.findFirst({
            where: {
                tenantId,
                key,
                ...(environment && { environment }),
                ...(includeArchived
                    ? {}
                    : { isArchived: false })
            }
        });
    }

    async findByTenant(
        tenantId: string,
        environment?: Environment
    ) {
        return this.prisma.featureFlag.findMany({
            where: {
                tenantId,
                isArchived: false,
                ...(environment && {
                    environment: environment as any
                })
            },
            orderBy: {
                key: "asc"
            }
        });
    }

    async findActiveByTenantAndEnv(
        tenantId: string,
        environment: Environment
    ) {
        return this.prisma.featureFlag.findMany({
            where: {
                tenantId,
                environment: environment as any,
                isActive: true,
                isArchived: false
            }
        });
    }

    async findActiveFlags(
        tenantId: string,
        environment: Environment
    ) {
        return this.prisma.featureFlag.findMany({
            where: {
                tenantId,
                environment,
                isActive: true,
                isArchived: false
            }
        });
    }

    async listFlags(
        tenantId: string,
        environment?: Environment
    ) {

        return this.prisma.featureFlag.findMany({
            where: {
                tenantId,
                ...(environment && {
                    environment
                })
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async update(
        tenantId: string,
        flagId: string,
        updates: Partial<{
            defaultValue: any;
            rolloutPercentage: number;
            isActive: boolean;
        }>
    ) {
        return this.prisma.featureFlag.update({
            where: {
                id: flagId,
                tenantId
            },
            data: updates
        });
    }

    async archive(
        tenantId: string,
        flagId: string
    ) {
        return this.prisma.featureFlag.update({
            where: {
                id: flagId,
                tenantId
            },
            data: {
                isArchived: true,
                isActive: false
            }
        });
    }
}