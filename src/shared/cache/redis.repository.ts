import Redis from "ioredis";
import { CacheRepository } from "./cache.repository";

export class RedisRepository implements CacheRepository {

    constructor(
        private readonly redis: Redis
    ) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);
        return (value) ? (JSON.parse(value) as T) : null;
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds: number
    ): Promise<void> {

        await this.redis.set(
            key,
            JSON.stringify(value),
            "EX",
            ttlSeconds
        );
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}