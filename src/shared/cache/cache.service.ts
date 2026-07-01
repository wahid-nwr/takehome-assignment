import { CacheRepository } from "./cache.repository";
import {
    cacheHitsTotal,
    cacheMissesTotal,
} from "../../metrics/metrics";

export class CacheService {

    constructor(
        private readonly repository: CacheRepository
    ) {}

    async get<T>(key: string): Promise<T | null> {

        const value = await this.repository.get<T>(key);

        if (value) {
            cacheHitsTotal.inc();
        } else {
            cacheMissesTotal.inc();
        }

        return value;
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds: number
    ): Promise<void> {
        await this.repository.set(key, value, ttlSeconds);
    }

    async delete(key: string): Promise<void> {
        await this.repository.delete(key);
    }
}