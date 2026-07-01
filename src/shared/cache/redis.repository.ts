import Redis from "ioredis";
import { CacheRepository } from "./cache.repository";
import { JsonValue } from "../../shared/types/json-value";
import {
    cacheHitsTotal,
    cacheMissesTotal,
} from "../../metrics/metrics";

export class RedisRepository implements CacheRepository {
    constructor(
        private readonly redis: Redis
    ) {}

    async get<T>(
        key: string
    ): Promise<T | null> {

        const value = await this.redis.get(key);

        if (!value) {
            cacheMissesTotal.inc();
            return null;
        }

        cacheHitsTotal.inc();

        return JSON.parse(value);
    }

    async set(
        key: string,
        value: JsonValue,
        ttl: number
    ) {

        await this.redis.set(
            key,
            JSON.stringify(value),
            'EX',
            ttl
        );
    }

    async delete(
        key: string
    ) {
        await this.redis.del(key);
    }
}