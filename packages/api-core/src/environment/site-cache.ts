import { MetaobjectSiteCache } from '@/lib';

// Site cache using Shopify Metaobjects for serverless compatibility.
// Caches site content in Shopify metaobjects to avoid database compute costs.
export const siteCache = new MetaobjectSiteCache({
	ttlMs: 4 * 60 * 60 * 1000 // 4h
});
