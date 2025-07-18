import crypto from 'node:crypto';
import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError, safeCompare } from '@repo/hono-utils';
import type { Context } from 'hono';
import { shopifyConfig } from '@/environment';

/**
 * Verifies Shopify App Proxy HMAC signature and extracts metadata.
 *
 * @param c - Hono context
 * @returns App Proxy metadata if verification succeeds
 * @see https://shopify.dev/docs/api/app-proxies#security
 */
export async function verifyShopifyAppProxy(
	c: Context
): Promise<TResult<TShopifyAppProxyMetadata, AppError>> {
	const metadataResult = extractShopifyAppProxyMetadata(c);
	if (metadataResult.isErr()) {
		return metadataResult;
	}

	const metadata = metadataResult.value;
	const query = new URL(c.req.url).searchParams;

	// Build sorted query string excluding the `hmac` param
	const rawParams: Record<string, string> = {};
	for (const [key, value] of query.entries()) {
		if (key !== 'hmac') rawParams[key] = value;
	}

	const sortedParams = Object.entries(rawParams)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const calculatedHmac = crypto
		.createHmac('sha256', shopifyConfig.apiSecret)
		.update(sortedParams)
		.digest('hex');

	if (!safeCompare(calculatedHmac, metadata.hmac)) {
		return Err(
			new AppError('#ERR_INVALID_APP_PROXY_HMAC', 401, {
				title: 'Invalid app proxy HMAC',
				detail: 'HMAC verification failed - request may not be from Shopify'
			})
		);
	}

	return Ok(metadata);
}

/**
 * Extracts and parses metadata from Shopify App Proxy request.
 */
function extractShopifyAppProxyMetadata(c: Context): TResult<TShopifyAppProxyMetadata, AppError> {
	const url = new URL(c.req.url);
	const query = url.searchParams;

	const hmac = query.get('hmac');
	if (hmac == null) {
		return Err(
			new AppError('#ERR_MISSING_HMAC', 401, {
				title: 'Missing HMAC',
				detail: 'HMAC query parameter is required'
			})
		);
	}

	const shop = query.get('shop');
	if (shop == null) {
		return Err(
			new AppError('#ERR_MISSING_SHOP', 400, {
				title: 'Missing shop',
				detail: 'Shop query parameter is required'
			})
		);
	}

	const timestamp = query.get('timestamp') ?? undefined;
	const pathPrefix = query.get('path_prefix') ?? undefined;
	const customerId = query.get('logged_in_customer_id') ?? undefined;

	return Ok({
		hmac,
		shop,
		timestamp,
		pathPrefix,
		customerId,
		query: Object.fromEntries(query.entries())
	});
}

export interface TShopifyAppProxyMetadata {
	/** Shop domain (e.g., 'my-store.myshopify.com') */
	shop: string;
	/** HMAC from Shopify (hex-encoded) */
	hmac: string;
	/** Optional timestamp for replay protection */
	timestamp?: string;
	/** App proxy path prefix (e.g., `/apps/your-app`) */
	pathPrefix?: string;
	/** Customer ID if the request is from a logged-in customer */
	customerId?: string;
	/** All parsed query params */
	query: Record<string, string>;
}
