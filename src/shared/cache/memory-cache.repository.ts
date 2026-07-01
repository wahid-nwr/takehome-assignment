import { CacheRepository } from "./cache.repository";

export class MemoryCacheRepository implements CacheRepository {

    private readonly cache = new Map<string, unknown>();

    async get<T>(key: string): Promise<T | null> {
        const value = await this.cache.get(key);
        return (value) ? (this.cache.get(key) as T) : null;
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds?: number
    ): Promise<void> {
        this.cache.set(key, value);

        if (ttlSeconds) {
            setTimeout(() => {
                this.cache.delete(key);
            }, ttlSeconds * 1000);
        }
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

}