import type { CacheService } from "../../../application/services/cacheService";
export declare class InMemoryCacheService implements CacheService {
    private cache;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    private cleanupExpired;
}
