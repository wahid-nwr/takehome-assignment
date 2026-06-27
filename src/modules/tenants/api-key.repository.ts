import { PrismaClient } from '@prisma/client';

export class ApiKeyRepository {

constructor(
        private prisma: PrismaClient
    ) {}

    async create(
        tenantId: string,
        keyHash: string,
        name?: string
    ) {
        return this.prisma.apiKey.create({
            data: {
                tenantId,
                keyHash,
                name
            }
        });
    }

    async findTenantByKeyHash(
        keyHash: string
    ) {
        return this.prisma.apiKey.findFirst({
            where: {
                keyHash,
                revokedAt: null
            },
            include: {
                tenant: true
            }
        });
    }

    async revoke(
        keyId: string
    ) {
        return this.prisma.apiKey.update({
            where: {
                id: keyId
            },
            data: {
                revokedAt: new Date()
            }
        });
    }
}