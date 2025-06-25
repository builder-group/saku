import crypto from 'node:crypto';
import { AppError, safeCompare } from '@repo/hono-utils';
import type { Context } from 'hono';
import { shopifyConfig } from '@/environment';

export async function verifyShopifyWebhook(c: Context): Promise<void> {
	const hmacHeader = c.req.header('x-shopify-hmac-sha256');

	if (hmacHeader == null) {
		throw new AppError('#ERR_MISSING_HMAC', 401, {
			title: 'Missing HMAC header',
			detail: 'X-Shopify-Hmac-Sha256 header is required for webhook verification'
		});
	}

	// Get the raw request body for HMAC calculation
	// Note: We need the raw body, not the parsed JSON
	const rawBody = await c.req.arrayBuffer();
	const bodyBuffer = new Uint8Array(rawBody);

	// Calculate HMAC using Shopify's client secret
	const calculatedHmac = crypto
		.createHmac('sha256', shopifyConfig.apiSecret)
		.update(bodyBuffer)
		.digest('base64');

	// Use timing-safe comparison to prevent timing attacks
	if (!safeCompare(calculatedHmac, hmacHeader)) {
		throw new AppError('#ERR_INVALID_WEBHOOK_HMAC', 401, {
			title: 'Invalid webhook HMAC',
			detail: 'Webhook HMAC verification failed - request may not be from Shopify'
		});
	}
}
