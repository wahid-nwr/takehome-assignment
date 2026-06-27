import Redis from "ioredis";
import { CacheRepository } from "./cache.repository";

export class RedisRepository implements CacheRepository {
    constructor(
        private redis: Redis
    ) {}

    async get<T>(
        key: string
    ): Promise<T | null> {

        const value =
            await this.redis.get(key);

        return value
            ? JSON.parse(value)
            : null;
    }

    async set(
        key: string,
        value: any,
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