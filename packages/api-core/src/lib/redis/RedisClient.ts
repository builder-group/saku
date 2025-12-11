import { Redis } from '@upstash/redis';

export class RedisClient {
	private client: Redis;
	private config: TRedisClientConfig;

	constructor(client: Redis, config: TRedisClientConfig) {
		this.client = client;
		this.config = config;
	}

	async getShopifySessionById(sessionId: string): Promise<TCachedShopifySession | null> {
		const key = this.config.keys.shopify.sessionById(sessionId);
		const cached = await this.client.get<string>(key);
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
		ttlSeconds = this.config.ttlSeconds
	): Promise<void> {
		const sessionKey = this.config.keys.shopify.sessionById(session.id);
		await this.client.set(sessionKey, JSON.stringify(session), { ex: ttlSeconds });
		await this.addSessionKeyToShopList(session.shop, sessionKey);
	}

	async getShopifySessionsByShop(shopId: string): Promise<TCachedShopifySession[] | null> {
		const shopKey = this.config.keys.shopify.sessionsByShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);
		if (sessionKeysString == null) {
			return null;
		}

		try {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			const sessions: TCachedShopifySession[] = [];

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
		ttlSeconds = this.config.ttlSeconds
	): Promise<void> {
		const sessionKeys: string[] = [];
		for (const session of sessions) {
			const sessionKey = this.config.keys.shopify.sessionById(session.id);
			await this.client.set(sessionKey, JSON.stringify(session), { ex: ttlSeconds });
			sessionKeys.push(sessionKey);
		}

		const shopKey = this.config.keys.shopify.sessionsByShop(shopId);
		await this.client.set(shopKey, JSON.stringify(sessionKeys), { ex: ttlSeconds });
	}

	private async addSessionKeyToShopList(shopId: string, sessionKey: string): Promise<void> {
		const shopKey = this.config.keys.shopify.sessionsByShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);

		if (sessionKeysString != null) {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			if (!sessionKeys.includes(sessionKey)) {
				sessionKeys.push(sessionKey);
				await this.client.set(shopKey, JSON.stringify(sessionKeys));
			}
		} else {
			await this.client.set(shopKey, JSON.stringify([sessionKey]));
		}
	}

	private async removeSessionKeyFromShopList(shopId: string, sessionKey: string): Promise<void> {
		const shopKey = this.config.keys.shopify.sessionsByShop(shopId);
		const sessionKeysString = await this.client.get<string>(shopKey);

		if (sessionKeysString != null) {
			const sessionKeys = JSON.parse(sessionKeysString) as string[];
			const index = sessionKeys.indexOf(sessionKey);
			if (index > -1) {
				sessionKeys.splice(index, 1);
				if (sessionKeys.length > 0) {
					await this.client.set(shopKey, JSON.stringify(sessionKeys));
				} else {
					await this.client.del(shopKey);
				}
			}
		}
	}

	async deleteShopifySession(sessionId: string): Promise<void> {
		const cached = await this.getShopifySessionById(sessionId);
		const shopId = cached?.shop;

		const sessionKey = this.config.keys.shopify.sessionById(sessionId);
		await this.client.del(sessionKey);

		if (shopId != null) {
			await this.removeSessionKeyFromShopList(shopId, sessionKey);
		}
	}

	async deleteShopifySessionsByShop(shopId: string): Promise<void> {
		const key = this.config.keys.shopify.sessionsByShop(shopId);
		await this.client.del(key);
	}

	async getShopifyOfflineAccessToken(shopId: string): Promise<string | null> {
		const cachedSessions = await this.getShopifySessionsByShop(shopId);
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
		if (cachedSessions == null) {
			return null;
		}

		const onlineSessions = cachedSessions.filter((session) => session.isOnline);
		if (onlineSessions.length === 0) {
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
			return null;
		}

		if (targetSession.expires != null && new Date() >= new Date(targetSession.expires)) {
			return null;
		}

		return {
			token: targetSession.accessToken,
			expiresAt: targetSession.expires
		};
	}
}

export interface TRedisClientKeys {
	shopify: {
		sessionById: (sessionId: string) => string;
		sessionsByShop: (shopId: string) => string;
	};
}

export interface TRedisClientConfig {
	keys: TRedisClientKeys;
	ttlSeconds: number;
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
