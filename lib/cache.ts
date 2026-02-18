/**
 * In-memory cache utility (fallback when Redis is not available)
 */

// Simple in-memory cache
const memoryCache = new Map<string, { value: any; expiry: number }>();

// Cache configuration
const DEFAULT_TTL = 60 * 5; // 5 minutes in seconds
const CACHE_PREFIX = "edustride:";

/**
 * Cache utility functions
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const item = memoryCache.get(fullKey);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expiry) {
      memoryCache.delete(fullKey);
      return null;
    }
    
    return item.value as T;
  },

  /**
   * Set value in cache with optional TTL
   */
  async set(
    key: string,
    value: unknown,
    ttl: number = DEFAULT_TTL
  ): Promise<void> {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const expiry = Date.now() + (ttl * 1000);
    memoryCache.set(fullKey, { value, expiry });
  },

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    const fullKey = `${CACHE_PREFIX}${key}`;
    memoryCache.delete(fullKey);
  },

  /**
   * Delete multiple values matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(`^${CACHE_PREFIX}${pattern.replace(/\*/g, '.*')}$`);
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  },

  /**
   * Invalidate user-related cache
   */
  async invalidateUser(userId: string): Promise<void> {
    await this.deletePattern(`user:${userId}:*`);
  },

  /**
   * Generate cache key
   */
  key(...parts: string[]): string {
    return parts.join(":");
  },
  
  /**
   * Invalidate cache matching pattern (alias for deletePattern)
   */
  async invalidate(pattern: string): Promise<void> {
    await this.deletePattern(pattern);
  },
};

/**
 * Cached query wrapper
 */
export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  // Try to get from cache
  const cached = await cache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Execute query
  const data = await queryFn();

  // Store in cache
  await cache.set(cacheKey, data, ttl);

  return data;
}

/**
 * Revalidate cache helper for server actions
 */
export async function revalidateCache(pattern: string): Promise<void> {
  await cache.deletePattern(pattern);
}
