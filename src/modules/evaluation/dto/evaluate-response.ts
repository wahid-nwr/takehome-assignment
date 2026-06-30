import { JsonValue } from "./../../../shared/types/json-value";

export interface EvaluateResponse {
    flags: Record<string, JsonValue>;
}