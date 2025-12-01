import { SiteCache } from '@/lib';

// Single in-memory cache instance for all app instances.
// No external cache needed since we run a single instance.
export const siteCache = new SiteCache({
	ttlMs: 4 * 60 * 60 * 1000, // 4h
	maxEntries: 100
});
