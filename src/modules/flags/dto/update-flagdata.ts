import { JsonValue } from "./../../../shared/types/json-value";

export type UpdateFlagData = {
    key?: string;
    name?: string;
    description?: string;
    rolloutPercentage?: number;
    isActive?: boolean;
    defaultValue?: JsonValue;
};