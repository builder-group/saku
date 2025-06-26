import crypto from 'node:crypto';
import { AppError, safeCompare } from '@repo/hono-utils';
import type { Context } from 'hono';
import { shopifyConfig } from '@/environment';

/**
 * Verifies a Shopify webhook by calculating the HMAC and comparing it to the header.
 *
 * @param c - Hono context
 * @returns Parsed webhook metadata
 * @throws AppError if verification fails
 *
 * @see https://shopify.dev/docs/apps/build/webhooks/subscribe/https
 */
export async function verifyShopifyWebhook(c: Context): Promise<TShopifyWebhookMetadata> {
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

	// Extract and return webhook metadata after successful verification
	return extractShopifyWebhookMetadata(c);
}

/**
 * Extracts Shopify webhook metadata from request headers.
 *
 * @param c - Hono context
 * @returns Parsed webhook metadata
 * @throws AppError if required headers are missing
 *
 * @see https://shopify.dev/docs/apps/build/webhooks#headers
 */
export function extractShopifyWebhookMetadata(c: Context): TShopifyWebhookMetadata {
	const topic = c.req.header('x-shopify-topic');
	const shopDomain = c.req.header('x-shopify-shop-domain');
	const webhookId = c.req.header('x-shopify-webhook-id');
	const triggeredAt = c.req.header('x-shopify-triggered-at');
	const eventId = c.req.header('x-shopify-event-id');
	const apiVersion = c.req.header('x-shopify-api-version');

	// Validate required headers
	if (topic == null) {
		throw new AppError('#ERR_MISSING_WEBHOOK_TOPIC', 400, {
			title: 'Missing webhook topic',
			detail: 'X-Shopify-Topic header is required'
		});
	}

	if (shopDomain == null) {
		throw new AppError('#ERR_MISSING_SHOP_DOMAIN', 400, {
			title: 'Missing shop domain',
			detail: 'X-Shopify-Shop-Domain header is required'
		});
	}

	if (webhookId == null) {
		throw new AppError('#ERR_MISSING_WEBHOOK_ID', 400, {
			title: 'Missing webhook ID',
			detail: 'X-Shopify-Webhook-Id header is required'
		});
	}

	if (triggeredAt == null) {
		throw new AppError('#ERR_MISSING_TRIGGERED_AT', 400, {
			title: 'Missing triggered at',
			detail: 'X-Shopify-Triggered-At header is required'
		});
	}

	if (eventId == null) {
		throw new AppError('#ERR_MISSING_EVENT_ID', 400, {
			title: 'Missing event ID',
			detail: 'X-Shopify-Event-Id header is required'
		});
	}

	// Parse triggered at timestamp
	const triggeredAtDate = new Date(triggeredAt);
	if (Number.isNaN(triggeredAtDate.getTime())) {
		throw new AppError('#ERR_INVALID_TRIGGERED_AT', 400, {
			title: 'Invalid triggered at timestamp',
			detail: 'X-Shopify-Triggered-At header must be a valid ISO date string'
		});
	}

	return {
		topic,
		shopDomain,
		webhookId,
		triggeredAt: triggeredAtDate,
		eventId,
		apiVersion
	};
}

export interface TShopifyWebhookMetadata {
	/** The name of the topic (e.g., 'app/uninstalled') */
	topic: string;
	/** Shop domain (e.g., 'my-shop.myshopify.com') */
	shopDomain: string;
	/** Unique webhook identifier */
	webhookId: string;
	/** Date and time when Shopify triggered the webhook */
	triggeredAt: Date;
	/** Unique event identifier for deduplication */
	eventId: string;
	/** API version used to serialize the webhook payload */
	apiVersion?: string;
}
