import { JsonValue } from "../../shared/types/json-value";

export interface CacheRepository {
    get<T>(key: string): Promise<T | null>;
    set(
        key: string,
        value: JsonValue,
        ttlSeconds: number
    ): Promise<void>;
    delete(key: string): Promise<void>;
}