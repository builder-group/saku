import type { TFlatSite, TSite } from '@repo/editor';

export class SiteCache<GContent extends TFlatSite | TSite = TFlatSite> {
	private cache = new Map<string, TCachedSiteData<GContent>>();
	private readonly ttlMs: number;
	private readonly maxEntries: number;

	constructor(config: TSiteCacheConfig = {}) {
		const { ttlMs = 4 * 60 * 60 * 1000, maxEntries = 100 } = config;
		this.ttlMs = ttlMs;
		this.maxEntries = maxEntries;
	}

	public get(shop: string, handle: string): { id: string; content: GContent } | null {
		const key = this.createKey(shop, handle);
		const cached = this.getCached(key);
		if (cached == null) {
			return null;
		}

		return {
			id: cached.id,
			content: cached.content
		};
	}

	public set(shop: string, handle: string, id: string, content: GContent): void {
		this.evictOldest();

		const key = this.createKey(shop, handle);
		const expiresAt = Date.now() + this.ttlMs;
		this.cache.set(key, {
			id,
			content,
			expiresAt
		});
	}

	public invalidate(shop: string, handle: string): void {
		const key = this.createKey(shop, handle);
		this.cache.delete(key);
	}

	public clear(): void {
		this.cache.clear();
	}

	private createKey(shop: string, handle: string): string {
		return `shop:${shop}:${handle}`;
	}

	private getCached(key: string): TCachedSiteData<GContent> | null {
		const cached = this.cache.get(key);
		if (cached == null) {
			return null;
		}

		if (Date.now() >= cached.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return cached;
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

interface TSiteCacheConfig {
	ttlMs?: number;
	maxEntries?: number;
}
