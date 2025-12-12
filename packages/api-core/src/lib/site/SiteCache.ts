import type { TFlatSite, TSite } from '@repo/editor';
import { logger, redisClient, shopifyConfig } from '@/environment';
import { deleteMetaobject, getMetaobjectByHandle, upsertMetaobject } from '@/lib';

export interface SiteCache<GContent extends TFlatSite | TSite = TFlatSite> {
	/**
	 * Retrieves cached site content by site handle.
	 * @returns Cached site data or null if not found/expired
	 */
	get(config: TGetSiteCacheConfig): Promise<{ siteId: string; siteContent: GContent } | null>;

	/**
	 * Stores site content in cache.
	 */
	set(config: TSetSiteCacheConfig): Promise<void>;

	/**
	 * Invalidates cached site content for a specific site handle.
	 */
	invalidate(config: TInvalidateSiteCacheConfig): Promise<void>;
}

export interface TGetSiteCacheConfig {
	siteHandle: string;
	shopId: string;
	accessToken: string;
}

export interface TSetSiteCacheConfig<GContent extends TFlatSite | TSite = TFlatSite> {
	siteHandle: string;
	siteId: string;
	siteContent: GContent;
	shopId: string;
	accessToken: string;
}

export interface TInvalidateSiteCacheConfig {
	siteHandle: string;
	shopId: string;
	accessToken: string;
}

export class MetaobjectSiteCache<
	GContent extends TFlatSite | TSite = TFlatSite
> implements SiteCache<GContent> {
	private readonly ttlMs: number;

	constructor(config: TMetaobjectSiteCacheConfig = {}) {
		const { ttlMs = shopifyConfig.metaobject.siteCache.ttlMs } = config;
		this.ttlMs = ttlMs;
	}

	public async get(
		config: TGetSiteCacheConfig
	): Promise<{ siteId: string; siteContent: GContent } | null> {
		const { siteHandle, shopId, accessToken } = config;
		const cacheHandle = this.createCacheHandle(shopId, siteHandle);

		const [isMetaobjectOk, metaobjectErr, metaobject] = await getMetaobjectByHandle(
			{
				handle: cacheHandle,
				type: shopifyConfig.metaobject.siteCache.type
			},
			{
				shopId,
				accessToken
			}
		);
		if (!isMetaobjectOk) {
			logger.error('Failed to get site cache:', { handle: cacheHandle, error: metaobjectErr });
			return null;
		}
		if (metaobject == null) {
			return null;
		}

		const expiresAt = metaobject.fields['expires_at'];
		if (expiresAt == null) {
			return null;
		}

		const expiresAtMs = new Date(expiresAt).getTime();
		if (Number.isNaN(expiresAtMs) || Date.now() >= expiresAtMs) {
			await this.invalidate({ siteHandle, shopId, accessToken });
			return null;
		}

		const contentJson = metaobject.fields['content'];
		if (contentJson == null) {
			return null;
		}

		let content: GContent;
		try {
			content = JSON.parse(contentJson) as GContent;
		} catch (error) {
			logger.error('Failed to parse site cache content:', { handle: cacheHandle, error });
			return null;
		}

		return {
			siteId: metaobject.fields['site_id'] ?? '',
			siteContent: content
		};
	}

	public async set(config: TSetSiteCacheConfig): Promise<void> {
		const { siteHandle, siteId, siteContent, shopId, accessToken } = config;
		const cacheHandle = this.createCacheHandle(shopId, siteHandle);
		const expiresAt = new Date(Date.now() + this.ttlMs).toISOString();

		const [isUpsertOk, upsertErr] = await upsertMetaobject(
			{
				handle: cacheHandle,
				type: shopifyConfig.metaobject.siteCache.type,
				fields: [
					{ key: 'site_id', value: siteId },
					{ key: 'content', value: JSON.stringify(siteContent) },
					{ key: 'expires_at', value: expiresAt }
				]
			},
			{ shopId, accessToken }
		);
		if (!isUpsertOk) {
			logger.error('Failed to upsert site cache:', { handle: cacheHandle, error: upsertErr });
		}
	}

	public async invalidate(config: TInvalidateSiteCacheConfig): Promise<void> {
		const { siteHandle, shopId, accessToken } = config;
		const cacheHandle = this.createCacheHandle(shopId, siteHandle);

		const [isMetaobjectOk, metaobjectErr, metaobject] = await getMetaobjectByHandle(
			{
				handle: cacheHandle,
				type: shopifyConfig.metaobject.siteCache.type
			},
			{
				shopId,
				accessToken
			}
		);
		if (!isMetaobjectOk) {
			logger.error('Failed to invalidate site cache:', {
				handle: cacheHandle,
				error: metaobjectErr
			});
			return;
		}
		if (metaobject == null) {
			return;
		}

		const [isDeleteOk, deleteErr] = await deleteMetaobject(
			{ id: metaobject.id },
			{ shopId, accessToken }
		);
		if (!isDeleteOk) {
			logger.error('Failed to invalidate site cache:', { handle: cacheHandle, error: deleteErr });
		}
	}

	private createCacheHandle(shopId: string, siteHandle: string): string {
		// Shopify metaobject handles must be lowercase, alphanumeric, with hyphens/underscores only
		// Format: [shopId]-[siteHandle] (sanitized)
		const sanitizedShop = shopId
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, '-')
			.replace(/-+/g, '-');
		const sanitizedHandle = siteHandle
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, '-')
			.replace(/-+/g, '-');
		return `${sanitizedShop}-${sanitizedHandle}`.replace(/^-+|-+$/g, '');
	}
}

interface TMetaobjectSiteCacheConfig {
	ttlMs?: number;
}

export class MemorySiteCache<
	GContent extends TFlatSite | TSite = TFlatSite
> implements SiteCache<GContent> {
	private cache = new Map<string, TCachedSiteData<GContent>>();
	private readonly ttlMs: number;
	private readonly maxEntries: number;

	constructor(config: TMemorySiteCacheConfig = {}) {
		const { ttlMs = 5 * 60 * 1000, maxEntries = 500 } = config;
		this.ttlMs = ttlMs;
		this.maxEntries = maxEntries;
	}

	public async get(
		config: TGetSiteCacheConfig
	): Promise<{ siteId: string; siteContent: GContent } | null> {
		const { siteHandle, shopId } = config;
		const key = this.createCacheKey(shopId, siteHandle);
		const cached = this.cache.get(key);
		if (cached == null) {
			return null;
		}

		if (Date.now() >= cached.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return {
			siteId: cached.id,
			siteContent: cached.content
		};
	}

	public async set(config: TSetSiteCacheConfig): Promise<void> {
		const { siteHandle, siteId, siteContent, shopId } = config;
		this.evictOldest();

		const key = this.createCacheKey(shopId, siteHandle);
		this.cache.set(key, {
			id: siteId,
			content: siteContent as GContent,
			expiresAt: Date.now() + this.ttlMs
		});
	}

	public async invalidate(config: TInvalidateSiteCacheConfig): Promise<void> {
		const { siteHandle, shopId } = config;
		const key = this.createCacheKey(shopId, siteHandle);
		this.cache.delete(key);
	}

	public clear(): void {
		this.cache.clear();
	}

	private createCacheKey(shopId: string, siteHandle: string): string {
		return `shop:${shopId}:${siteHandle}`;
	}

	private evictOldest(): void {
		if (this.cache.size < this.maxEntries) {
			return;
		}

		const firstKey = this.cache.keys().next().value;
		if (firstKey != null) {
			this.cache.delete(firstKey);
		}
	}
}

interface TCachedSiteData<GContent = unknown> {
	id: string;
	content: GContent;
	expiresAt: number;
}

interface TMemorySiteCacheConfig {
	ttlMs?: number;
	maxEntries?: number;
}

export class RedisSiteCache<
	GContent extends TFlatSite | TSite = TFlatSite
> implements SiteCache<GContent> {
	public async get(
		config: TGetSiteCacheConfig
	): Promise<{ siteId: string; siteContent: GContent } | null> {
		const { siteHandle, shopId } = config;
		return redisClient.getSiteCache<GContent>(shopId, siteHandle);
	}

	public async set(config: TSetSiteCacheConfig): Promise<void> {
		const { siteHandle, siteId, siteContent, shopId } = config;
		await redisClient.setSiteCache(shopId, siteHandle, siteId, siteContent);
	}

	public async invalidate(config: TInvalidateSiteCacheConfig): Promise<void> {
		const { siteHandle, shopId } = config;
		await redisClient.deleteSiteCache(shopId, siteHandle);
	}
}
