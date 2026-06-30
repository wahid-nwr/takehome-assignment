import { JsonValue } from "./../../../shared/types/json-value";

export interface UpdateFlagData {
    defaultValue?: JsonValue;
    rolloutPercentage?: number;
    isActive?: boolean;
}