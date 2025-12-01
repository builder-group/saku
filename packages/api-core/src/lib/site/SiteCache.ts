import type { TFlatSite, TSite } from '@repo/editor';

export class SiteCache<GContent extends TFlatSite | TSite = TFlatSite> {
	private cache = new Map<string, TCachedSiteData<GContent>>();
	private readonly ttlMs: number;
	private readonly maxEntries: number;

	constructor(config: TSiteCacheConfig = {}) {
		const { ttlMs = 5 * 60 * 1000, maxEntries = 500 } = config;
		this.ttlMs = ttlMs;
		this.maxEntries = maxEntries;
	}

	public get(shop: string, handle: string): { id: string; content: GContent } | null {
		const key = this.createKey(shop, handle);
		const cached = this.cache.get(key);
		if (cached == null) {
			return null;
		}

		if (Date.now() >= cached.expiresAt) {
			this.cache.delete(key);
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
		this.cache.set(key, {
			id,
			content,
			expiresAt: Date.now() + this.ttlMs
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
