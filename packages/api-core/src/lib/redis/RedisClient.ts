import { Redis } from '@upstash/redis';
import { logger } from '../../environment';

export class RedisClient {
	private client: Redis;

	private shopifySessionConfig: TRedisClientConfig['shopifySession'];

	constructor(client: Redis, config: TRedisClientConfig) {
		this.client = client;
		this.shopifySessionConfig = config.shopifySession;
	}

	async getShopifySessionById(sessionId: string): Promise<TCachedShopifySession | null> {
		const key = this.shopifySessionConfig.keys.byId(sessionId);
		const cached = await this.client.get<string>(key);
		logger.info('Getting Shopify session by ID', { sessionId, key, cached });
		if (cached == null) {
			return null;
		}

		try {
			return JSON.parse(cached) as TCachedShopifySession;
		} catch {
			await this.client.del(key);
			return null;
		}
	}

	async setShopifySession(
		session: TCachedShopifySession,
		ttlSeconds = this.shopifySessionConfig.ttl
	): Promise<void> {
		const sessionKey = this.shopifySessionConfig.keys.byId(session.id);
		logger.info('Setting Shopify session', { sessionId: session.id, sessionKey, session });
		await this.client.set(sessionKey, JSON.stringify(session), { ex: ttlSeconds });
		await this.addSessionKeyToShopList(session.shop, sessionKey);
	}

	async getShopifySessionsByShop(shopId: string): Promise<TCachedShopifySession[] | null> {
		const shopKey = this.shopifySessionConfig.keys.byShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);
		if (sessionKeysString == null) {
			return null;
		}

		try {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			const sessions: TCachedShopifySession[] = [];
			logger.info('Getting Shopify sessions by shop', { shopId, shopKey, sessionKeysString });

			for (const sessionKey of sessionKeys) {
				const sessionString = await this.client.get<string>(sessionKey);
				if (sessionString != null) {
					try {
						const session = JSON.parse(sessionString) as TCachedShopifySession;
						sessions.push(session);
					} catch {
						// Invalid session, skip it
					}
				}
			}

			return sessions.length > 0 ? sessions : null;
		} catch {
			await this.client.del(shopKey);
			return null;
		}
	}

	async setShopifySessionsByShop(
		shopId: string,
		sessions: TCachedShopifySession[],
		ttlSeconds = this.shopifySessionConfig.ttl
	): Promise<void> {
		const sessionKeys: string[] = [];
		logger.info('Setting Shopify sessions by shop', { shopId, sessions });
		for (const session of sessions) {
			const sessionKey = this.shopifySessionConfig.keys.byId(session.id);
			await this.client.set(sessionKey, JSON.stringify(session), { ex: ttlSeconds });
			sessionKeys.push(sessionKey);
		}

		const shopKey = this.shopifySessionConfig.keys.byShop(shopId);
		await this.client.set(shopKey, JSON.stringify(sessionKeys), { ex: ttlSeconds });
	}

	private async addSessionKeyToShopList(shopId: string, sessionKey: string): Promise<void> {
		const shopKey = this.shopifySessionConfig.keys.byShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);

		if (sessionKeysString != null) {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			if (!sessionKeys.includes(sessionKey)) {
				sessionKeys.push(sessionKey);
				await this.client.set(shopKey, JSON.stringify(sessionKeys), {
					ex: this.shopifySessionConfig.ttl
				});
			}
		} else {
			await this.client.set(shopKey, JSON.stringify([sessionKey]), {
				ex: this.shopifySessionConfig.ttl
			});
		}
	}

	private async removeSessionKeyFromShopList(shopId: string, sessionKey: string): Promise<void> {
		const shopKey = this.shopifySessionConfig.keys.byShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);

		if (sessionKeysString != null) {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			const index = sessionKeys.indexOf(sessionKey);
			if (index > -1) {
				sessionKeys.splice(index, 1);
				if (sessionKeys.length > 0) {
					await this.client.set(shopKey, JSON.stringify(sessionKeys), {
						ex: this.shopifySessionConfig.ttl
					});
				} else {
					await this.client.del(shopKey);
				}
			}
		}
	}

	async deleteShopifySession(sessionId: string): Promise<void> {
		const cached = await this.getShopifySessionById(sessionId);
		const shopId = cached?.shop;

		const sessionKey = this.shopifySessionConfig.keys.byId(sessionId);
		logger.info('Deleting Shopify session', { sessionId, sessionKey });
		await this.client.del(sessionKey);

		if (shopId != null) {
			await this.removeSessionKeyFromShopList(shopId, sessionKey);
		}
	}

	async deleteShopifySessionsByShop(shopId: string): Promise<void> {
		const key = this.shopifySessionConfig.keys.byShop(shopId);
		logger.info('Deleting Shopify sessions by shop', { shopId, key });
		await this.client.del(key);
	}

	async getShopifyOfflineAccessToken(shopId: string): Promise<string | null> {
		const cachedSessions = await this.getShopifySessionsByShop(shopId);
		logger.info('Getting Shopify offline access token', { shopId, cachedSessions });
		if (cachedSessions == null) {
			return null;
		}

		const offlineSession = cachedSessions.find((session) => !session.isOnline);
		return offlineSession?.accessToken ?? null;
	}

	async getShopifyOnlineAccessToken(
		shopId: string,
		userId?: string
	): Promise<TCachedOnlineAccessToken | null> {
		const cachedSessions = await this.getShopifySessionsByShop(shopId);
		logger.info('Getting Shopify online access token', { shopId, cachedSessions });
		if (cachedSessions == null) {
			return null;
		}

		const onlineSessions = cachedSessions.filter((session) => session.isOnline);
		if (onlineSessions.length === 0) {
			logger.info('No online sessions found', { shopId, onlineSessions });
			return null;
		}

		let targetSession: TCachedShopifySession | undefined;
		if (userId != null) {
			const sessionId = `${shopId}_${userId}`;
			targetSession = onlineSessions.find((session) => session.id === sessionId);
		} else {
			targetSession = onlineSessions.sort((a, b) => {
				const aExpires = a.expires != null ? new Date(a.expires).getTime() : 0;
				const bExpires = b.expires != null ? new Date(b.expires).getTime() : 0;
				return bExpires - aExpires;
			})[0];
		}

		if (targetSession == null) {
			logger.info('No target session found', { shopId, userId });
			return null;
		}

		if (targetSession.expires != null && new Date() >= new Date(targetSession.expires)) {
			logger.info('Target session expired', { shopId, userId });
			return null;
		}

		logger.info('Returning Shopify online access token', { shopId, userId, targetSession });
		return {
			token: targetSession.accessToken,
			expiresAt: targetSession.expires
		};
	}
}

export interface TRedisClientConfig {
	shopifySession: {
		keys: {
			byId: (sessionId: string) => string;
			byShop: (shopId: string) => string;
		};
		ttl: number;
	};
}

export interface TCachedOnlineAccessToken {
	token: string;
	expiresAt: string | null;
}

export interface TCachedShopifySession {
	id: string;
	shop: string;
	state: string;
	isOnline: boolean;
	scope: string;
	expires: string | null;
	accessToken: string;
	mantleApiToken: string | null;
	onlineAccessInfo: {
		associatedUser: {
			id: number;
			firstName: string;
			lastName: string;
			email: string;
			accountOwner: boolean;
			locale: string;
			collaborator: boolean;
			emailVerified: boolean;
		};
		expiresIn?: number;
		associatedUserScope?: string;
		session?: string;
		accountNumber?: number | null;
	} | null;
}
