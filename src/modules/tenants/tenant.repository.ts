import { PrismaClient } from '@prisma/client';

export class TenantRepository {

constructor(
        private prisma: PrismaClient
    ) {}

    async create(name: string) {
        return this.prisma.tenant.create({
            data: {
                name
            }
        });
    }

    async findById(id: string) {
        return this.prisma.tenant.findUnique({
            where: {
                id
            }
        });
    }

    async findByName(name: string) {
        return this.prisma.tenant.findUnique({
            where: {
                name
            }
        });
    }
}