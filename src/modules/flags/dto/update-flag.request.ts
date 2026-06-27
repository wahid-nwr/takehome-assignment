import {
    Environment,
    FlagType
} from "@prisma/client";
import { JsonValue } from "../../../shared/types/json-value";

export interface UpdateFlagRequest {
    key?: string;
    name?: string;
    description?: string;
    type?: FlagType;
    defaultValue?: JsonValue;
    environment?: Environment;
    rolloutPercentage?: number;
    isActive?: boolean;
}