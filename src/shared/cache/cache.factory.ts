import Redis from "ioredis";

import { CacheService } from "./cache.service";
import { MemoryCacheRepository } from "./memory-cache.repository";
import { RedisRepository } from "./redis.repository";

export function createCacheService(): CacheService {

    const repository = process.env.REDIS_URL
        ? new RedisRepository(new Redis(process.env.REDIS_URL))
        : new MemoryCacheRepository();

    return new CacheService(repository);
}