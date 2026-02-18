import { Redis } from "ioredis";

// Redis client configuration
const getRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
  }

  // Return null if no Redis URL is configured
  return null;
};

const redis = getRedisClient();

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
    if (!redis) return null;

    try {
      const value = await redis.get(`${CACHE_PREFIX}${key}`);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  /**
   * Set value in cache with optional TTL
   */
  async set(
    key: string,
    value: unknown,
    ttl: number = DEFAULT_TTL
  ): Promise<void> {
    if (!redis) return;

    try {
      const serialized = JSON.stringify(value);
      await redis.setex(`${CACHE_PREFIX}${key}`, ttl, serialized);
    } catch (error) {
      console.error("Cache set error:", error);
    }
  },

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    if (!redis) return;

    try {
      await redis.del(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  },

  /**
   * Delete multiple values matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    if (!redis) return;

    try {
      const keys = await redis.keys(`${CACHE_PREFIX}${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("Cache delete pattern error:", error);
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
};

/**
 * Cached query wrapper
 * Usage:
 * const data = await cachedQuery(
 *   cache.key("user", userId, "portfolio"),
 *   () => prisma.portfolio.findMany({ where: { userId } }),
 *   300 // 5 minutes TTL
 * );
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
