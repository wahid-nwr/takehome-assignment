import {
    Environment,
    FlagType
} from "@prisma/client";
export interface UpdateFlagRequest {
    key?: string;
    name?: string;
    description?: string;
    type?: FlagType;
    defaultValue?: unknown;
    environment?: Environment;
    rolloutPercentage?: number;
    isActive?: boolean;
}