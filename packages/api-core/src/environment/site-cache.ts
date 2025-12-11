import { MetaobjectSiteCache } from '@/lib';

// Site cache using Shopify Metaobjects for serverless compatibility.
// Caches site content in Shopify metaobjects to avoid database compute costs.
export const siteCache = new MetaobjectSiteCache();
