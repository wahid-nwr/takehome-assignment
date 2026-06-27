import {
    Environment,
    FlagType,
    PrismaClient
} from "@prisma/client";

interface CreateFlagData {
    tenantId: string;
    key: string;
    name: string;
    description?: string;

    type: FlagType;
    defaultValue: unknown;

    rolloutPercentage: number;
    environment: Environment;
}