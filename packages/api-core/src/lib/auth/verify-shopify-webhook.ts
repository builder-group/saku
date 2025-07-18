import crypto from 'node:crypto';
import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError, safeCompare, type TRawRequestBody } from '@repo/hono-utils';
import type { Context } from 'hono';
import { shopifyConfig } from '@/environment';

/**
 * Verifies Shopify webhook HMAC signature and extracts metadata.
 *
 * Requires captureRawBodyMiddleware to preserve the original request body
 * before OpenAPI validation consumes it.
 *
 * Direct access via `c.req.text()` or `c.req.arrayBuffer()` after validation returns
 * different data than the original network payload (e.g. JSON escaping normalization),
 * causing HMAC verification to fail.
 *
 * @param c - Hono context with rawRequestBody from captureRawBodyMiddleware
 * @returns Webhook metadata if verification succeeds
 * @see https://shopify.dev/docs/apps/build/webhooks/subscribe/https
 */
export async function verifyShopifyWebhook(
	c: Context
): Promise<TResult<TShopifyWebhookMetadata, AppError>> {
	const metadataResult = extractShopifyWebhookMetadata(c);
	if (metadataResult.isErr()) {
		return metadataResult;
	}

	const metadata = metadataResult.value;
	const rawBody = c.get('rawRequestBody') as TRawRequestBody;
	if (rawBody == null) {
		return Err(
			new AppError('#ERR_NO_RAW_BODY', 500, {
				title: 'Raw request body not available',
				detail:
					'Raw request body is required for HMAC verification. Ensure captureRawBodyMiddleware is used.'
			})
		);
	}

	const calculatedHmac = crypto
		.createHmac('sha256', shopifyConfig.apiSecret)
		.update(rawBody.bytes())
		.digest('base64');

	if (!safeCompare(calculatedHmac, metadata.hmac)) {
		return Err(
			new AppError('#ERR_INVALID_WEBHOOK_HMAC', 401, {
				title: 'Invalid webhook HMAC',
				detail: 'Webhook HMAC verification failed - request may not be from Shopify'
			})
		);
	}

	return Ok(metadata);
}

/**
 * Extracts webhook metadata from Shopify headers.
 */
function extractShopifyWebhookMetadata(c: Context): TResult<TShopifyWebhookMetadata, AppError> {
	const topic = c.req.header('x-shopify-topic');
	if (topic == null) {
		return Err(
			new AppError('#ERR_MISSING_WEBHOOK_TOPIC', 400, {
				title: 'Missing webhook topic',
				detail: 'X-Shopify-Topic header is required'
			})
		);
	}

	const hmac = c.req.header('x-shopify-hmac-sha256');
	if (hmac == null) {
		return Err(
			new AppError('#ERR_MISSING_HMAC', 401, {
				title: 'Missing HMAC',
				detail: 'X-Shopify-Hmac-Sha256 header is required'
			})
		);
	}

	const shopDomain = c.req.header('x-shopify-shop-domain');
	if (shopDomain == null) {
		return Err(
			new AppError('#ERR_MISSING_SHOP_DOMAIN', 400, {
				title: 'Missing shop domain',
				detail: 'X-Shopify-Shop-Domain header is required'
			})
		);
	}

	const webhookId = c.req.header('x-shopify-webhook-id');
	if (webhookId == null) {
		return Err(
			new AppError('#ERR_MISSING_WEBHOOK_ID', 400, {
				title: 'Missing webhook ID',
				detail: 'X-Shopify-Webhook-Id header is required'
			})
		);
	}

	const triggeredAtString = c.req.header('x-shopify-triggered-at');
	if (triggeredAtString == null) {
		return Err(
			new AppError('#ERR_MISSING_TRIGGERED_AT', 400, {
				title: 'Missing triggered at',
				detail: 'X-Shopify-Triggered-At header is required'
			})
		);
	}
	const triggeredAt = new Date(triggeredAtString);
	if (Number.isNaN(triggeredAt.getTime())) {
		return Err(
			new AppError('#ERR_INVALID_TRIGGERED_AT', 400, {
				title: 'Invalid triggered at timestamp',
				detail: 'X-Shopify-Triggered-At header must be a valid ISO date string'
			})
		);
	}

	const eventId = c.req.header('x-shopify-event-id');
	if (eventId == null) {
		return Err(
			new AppError('#ERR_MISSING_EVENT_ID', 400, {
				title: 'Missing event ID',
				detail: 'X-Shopify-Event-Id header is required'
			})
		);
	}

	const apiVersion = c.req.header('x-shopify-api-version');

	return Ok({
		topic,
		hmac,
		shopDomain,
		webhookId,
		triggeredAt,
		eventId,
		apiVersion
	});
}

export interface TShopifyWebhookMetadata {
	/** The name of the topic (e.g., 'app/uninstalled') */
	topic: string;
	/** HMAC (Hash-based Message Authentication Code) to verify the integrity and authenticity of the request */
	hmac: string;
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
