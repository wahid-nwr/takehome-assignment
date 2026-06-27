import {
    Environment,
    FlagType,
    Prisma
} from "@prisma/client";

export interface CreateFlagRequest {
    key: string;
    name: string;
    description?: string;
    type: FlagType;
    defaultValue: Prisma.InputJsonValue;
    environment: Environment;
    rolloutPercentage: number;
}