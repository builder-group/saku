import { Redis } from '@upstash/redis';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisClient, type TCachedShopifySession, type TRedisClientConfig } from './RedisClient';

const mockConfig: TRedisClientConfig = {
	shopifySession: {
		keys: {
			byId: (sessionId: string) => `saku:shopify:session:${sessionId}`,
			byShop: (shopId: string) => `saku:shopify:sessions:shop:${shopId}`
		},
		ttl: 5
	}
};

describe('RedisClient', () => {
	let mockRedis: {
		get: ReturnType<typeof vi.fn>;
		set: ReturnType<typeof vi.fn>;
		del: ReturnType<typeof vi.fn>;
	};
	let redisClient: RedisClient;

	beforeEach(() => {
		mockRedis = {
			get: vi.fn(),
			set: vi.fn(),
			del: vi.fn()
		};

		redisClient = new RedisClient(mockRedis as unknown as Redis, mockConfig);
	});

	describe('getShopifySessionById', () => {
		it('should return cached session when found', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			mockRedis.get.mockResolvedValue(JSON.stringify(session));

			const result = await redisClient.getShopifySessionById('session-1');

			expect(result).toEqual(session);
			expect(mockRedis.get).toHaveBeenCalledWith('saku:shopify:session:session-1');
		});

		it('should return null when session not found', async () => {
			mockRedis.get.mockResolvedValue(null);

			const result = await redisClient.getShopifySessionById('session-1');

			expect(result).toBeNull();
		});

		it('should return null and delete key when JSON is invalid', async () => {
			mockRedis.get.mockResolvedValue('invalid-json');

			const result = await redisClient.getShopifySessionById('session-1');

			expect(result).toBeNull();
			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:session:session-1');
		});
	});

	describe('setShopifySession', () => {
		it('should store session and add to shop list when shop list does not exist', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			mockRedis.get.mockResolvedValue(null);

			await redisClient.setShopifySession(session);

			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:session:session-1',
				JSON.stringify(session),
				{ ex: 5 }
			);
			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:sessions:shop:shop.myshopify.com',
				JSON.stringify(['saku:shopify:session:session-1'])
			);
		});

		it('should add session key to existing shop list', async () => {
			const session: TCachedShopifySession = {
				id: 'session-2',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-456',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const existingShopList = ['saku:shopify:session:session-1'];
			mockRedis.get.mockResolvedValue(JSON.stringify(existingShopList));

			await redisClient.setShopifySession(session);

			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:sessions:shop:shop.myshopify.com',
				JSON.stringify(['saku:shopify:session:session-1', 'saku:shopify:session:session-2'])
			);
		});

		it('should not duplicate session key in shop list', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const existingShopList = ['saku:shopify:session:session-1'];
			mockRedis.get.mockResolvedValue(JSON.stringify(existingShopList));

			await redisClient.setShopifySession(session);

			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:session:session-1',
				JSON.stringify(session),
				{ ex: 5 }
			);
			expect(mockRedis.set).toHaveBeenCalledTimes(1);
		});

		it('should use custom TTL when provided', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			mockRedis.get.mockResolvedValue(null);

			await redisClient.setShopifySession(session, 10);

			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:session:session-1',
				JSON.stringify(session),
				{ ex: 10 }
			);
		});
	});

	describe('getShopifySessionsByShop', () => {
		it('should return null when shop list does not exist', async () => {
			mockRedis.get.mockResolvedValue(null);

			const result = await redisClient.getShopifySessionsByShop('shop.myshopify.com');

			expect(result).toBeNull();
		});

		it('should return sessions when all are found', async () => {
			const session1: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const session2: TCachedShopifySession = {
				id: 'session-2',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'token-456',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:session-1', 'saku:shopify:session:session-2'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session1))
				.mockResolvedValueOnce(JSON.stringify(session2));

			const result = await redisClient.getShopifySessionsByShop('shop.myshopify.com');

			expect(result).toEqual([session1, session2]);
		});

		it('should skip invalid sessions and return valid ones', async () => {
			const session1: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:session-1', 'saku:shopify:session:session-2'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session1))
				.mockResolvedValueOnce('invalid-json');

			const result = await redisClient.getShopifySessionsByShop('shop.myshopify.com');

			expect(result).toEqual([session1]);
		});

		it('should return null when no valid sessions found', async () => {
			const sessionKeys = ['saku:shopify:session:session-1', 'saku:shopify:session:session-2'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce('invalid-json');

			const result = await redisClient.getShopifySessionsByShop('shop.myshopify.com');

			expect(result).toBeNull();
		});

		it('should return null and delete shop key when shop list JSON is invalid', async () => {
			mockRedis.get.mockResolvedValue('invalid-json');

			const result = await redisClient.getShopifySessionsByShop('shop.myshopify.com');

			expect(result).toBeNull();
			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:sessions:shop:shop.myshopify.com');
		});
	});

	describe('setShopifySessionsByShop', () => {
		it('should store all sessions individually and create shop list', async () => {
			const session1: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const session2: TCachedShopifySession = {
				id: 'session-2',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'token-456',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			await redisClient.setShopifySessionsByShop('shop.myshopify.com', [session1, session2]);

			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:session:session-1',
				JSON.stringify(session1),
				{ ex: 5 }
			);
			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:session:session-2',
				JSON.stringify(session2),
				{ ex: 5 }
			);
			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:sessions:shop:shop.myshopify.com',
				JSON.stringify(['saku:shopify:session:session-1', 'saku:shopify:session:session-2']),
				{ ex: 5 }
			);
		});
	});

	describe('deleteShopifySession', () => {
		it('should delete session and remove from shop list when session is cached', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const existingShopList = ['saku:shopify:session:session-1', 'saku:shopify:session:session-2'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(session))
				.mockResolvedValueOnce(JSON.stringify(existingShopList));

			await redisClient.deleteShopifySession('session-1');

			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:session:session-1');
			expect(mockRedis.set).toHaveBeenCalledWith(
				'saku:shopify:sessions:shop:shop.myshopify.com',
				JSON.stringify(['saku:shopify:session:session-2'])
			);
		});

		it('should delete shop list when it becomes empty', async () => {
			const session: TCachedShopifySession = {
				id: 'session-1',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'token-123',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const existingShopList = ['saku:shopify:session:session-1'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(session))
				.mockResolvedValueOnce(JSON.stringify(existingShopList));

			await redisClient.deleteShopifySession('session-1');

			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:session:session-1');
			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:sessions:shop:shop.myshopify.com');
		});

		it('should only delete session when session is not cached', async () => {
			mockRedis.get.mockResolvedValue(null);

			await redisClient.deleteShopifySession('session-1');

			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:session:session-1');
			expect(mockRedis.del).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteShopifySessionsByShop', () => {
		it('should delete shop list', async () => {
			await redisClient.deleteShopifySessionsByShop('shop.myshopify.com');

			expect(mockRedis.del).toHaveBeenCalledWith('saku:shopify:sessions:shop:shop.myshopify.com');
		});
	});

	describe('getShopifyOfflineAccessToken', () => {
		it('should return offline access token when found', async () => {
			const offlineSession: TCachedShopifySession = {
				id: 'offline_shop.myshopify.com',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'offline-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const onlineSession: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'online-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = [
				'saku:shopify:session:offline_shop.myshopify.com',
				'saku:shopify:session:shop.myshopify.com_123'
			];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(offlineSession))
				.mockResolvedValueOnce(JSON.stringify(onlineSession));

			const result = await redisClient.getShopifyOfflineAccessToken('shop.myshopify.com');

			expect(result).toBe('offline-token');
		});

		it('should return null when no offline session found', async () => {
			const onlineSession: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'online-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_123'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(onlineSession));

			const result = await redisClient.getShopifyOfflineAccessToken('shop.myshopify.com');

			expect(result).toBeNull();
		});

		it('should return null when shop list does not exist', async () => {
			mockRedis.get.mockResolvedValue(null);

			const result = await redisClient.getShopifyOfflineAccessToken('shop.myshopify.com');

			expect(result).toBeNull();
		});
	});

	describe('getShopifyOnlineAccessToken', () => {
		it('should return online access token when found without userId', async () => {
			const session: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'online-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_123'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toEqual({
				token: 'online-token',
				expiresAt: '2025-12-31T00:00:00.000Z'
			});
		});

		it('should return most recent online access token when multiple exist', async () => {
			const olderSession: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-01-01T00:00:00.000Z',
				accessToken: 'older-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const newerSession: TCachedShopifySession = {
				id: 'shop.myshopify.com_456',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'newer-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = [
				'saku:shopify:session:shop.myshopify.com_123',
				'saku:shopify:session:shop.myshopify.com_456'
			];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(olderSession))
				.mockResolvedValueOnce(JSON.stringify(newerSession));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toEqual({
				token: 'newer-token',
				expiresAt: '2025-12-31T00:00:00.000Z'
			});
		});

		it('should return specific user token when userId is provided', async () => {
			const session: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'user-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_123'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com', '123');

			expect(result).toEqual({
				token: 'user-token',
				expiresAt: '2025-12-31T00:00:00.000Z'
			});
		});

		it('should return null when token is expired', async () => {
			const expiredDate = new Date();
			expiredDate.setSeconds(expiredDate.getSeconds() - 1);

			const session: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: expiredDate.toISOString(),
				accessToken: 'expired-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_123'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toBeNull();
		});

		it('should return token when expires is null', async () => {
			const session: TCachedShopifySession = {
				id: 'shop.myshopify.com_123',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: null,
				accessToken: 'token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_123'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toEqual({
				token: 'token',
				expiresAt: null
			});
		});

		it('should return null when no online sessions found', async () => {
			const offlineSession: TCachedShopifySession = {
				id: 'offline_shop.myshopify.com',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: false,
				scope: 'read_products',
				expires: null,
				accessToken: 'offline-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:offline_shop.myshopify.com'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(offlineSession));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toBeNull();
		});

		it('should return null when specific user session not found', async () => {
			const session: TCachedShopifySession = {
				id: 'shop.myshopify.com_456',
				shop: 'shop.myshopify.com',
				state: '',
				isOnline: true,
				scope: 'read_products',
				expires: '2025-12-31T00:00:00.000Z',
				accessToken: 'other-user-token',
				mantleApiToken: null,
				onlineAccessInfo: null
			};

			const sessionKeys = ['saku:shopify:session:shop.myshopify.com_456'];

			mockRedis.get
				.mockResolvedValueOnce(JSON.stringify(sessionKeys))
				.mockResolvedValueOnce(JSON.stringify(session));

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com', '123');

			expect(result).toBeNull();
		});

		it('should return null when shop list does not exist', async () => {
			mockRedis.get.mockResolvedValue(null);

			const result = await redisClient.getShopifyOnlineAccessToken('shop.myshopify.com');

			expect(result).toBeNull();
		});
	});
});
