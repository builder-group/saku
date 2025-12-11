import { Redis } from '@upstash/redis';
import { RedisClient } from '@/lib/redis';
import { redisConfig } from '../configs';

export const upstashRedisClient = new Redis({
	url: redisConfig.url,
	token: redisConfig.token
});

export const redisClient = new RedisClient(upstashRedisClient, {
	shopifySession: redisConfig.cached.shopifySession
});
