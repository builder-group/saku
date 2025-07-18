import crypto from 'node:crypto';
import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError, safeCompare } from '@repo/hono-utils';
import type { Context } from 'hono';

/**
 * Verifies HMAC signature for server-to-server authentication.
 *
 * Expected format:
 * - Authorization: HMAC <signature>
 * - X-Timestamp: <timestamp>
 * - Body: <request body> (optional)
 *
 * Signature is calculated as: HMAC-SHA256(secret, timestamp + "." + method + "." + path + "." + body)
 *
 * @param c - Hono context
 * @param config - Configuration for HMAC verification
 * @returns void on success, AppError on failure
 */
export async function verifyHmacSignature(
	c: Context,
	config: TVerifyHmacSignatureConfig
): Promise<TResult<void, AppError>> {
	const { secret, maxAgeMs = 5 * 60 * 1000 } = config;

	const authHeader = c.req.header('authorization');
	const timestampHeader = c.req.header('x-timestamp');

	if (authHeader == null) {
		return Err(
			new AppError('#ERR_MISSING_AUTH_HEADER', 401, {
				detail: 'Missing authorization header'
			})
		);
	}

	if (!authHeader.startsWith('HMAC ')) {
		return Err(
			new AppError('#ERR_INVALID_AUTH_FORMAT', 401, {
				detail: 'Authorization header must use HMAC format'
			})
		);
	}

	const signature = authHeader.substring(5); // Remove "HMAC " prefix

	if (timestampHeader == null) {
		return Err(
			new AppError('#ERR_MISSING_TIMESTAMP', 401, {
				detail: 'Missing X-Timestamp header'
			})
		);
	}

	// Validate timestamp to prevent replay attacks
	const timestamp = parseInt(timestampHeader, 10);
	if (Number.isNaN(timestamp)) {
		return Err(
			new AppError('#ERR_INVALID_TIMESTAMP', 401, {
				detail: 'Invalid timestamp format'
			})
		);
	}

	const now = Date.now();
	const age = now - timestamp;
	if (age < 0 || age > maxAgeMs) {
		return Err(
			new AppError('#ERR_REQUEST_EXPIRED', 401, {
				detail: `Request timestamp is too old or in the future. Age: ${age}ms, Max: ${maxAgeMs}ms`
			})
		);
	}

	// Get request details
	const method = c.req.method;
	const path = new URL(c.req.url).pathname;
	const body = await c.req.text();

	// Calculate expected signature
	const payload = `${timestamp}.${method}.${path}.${body}`;
	const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

	if (!safeCompare(signature, expectedSignature)) {
		return Err(
			new AppError('#ERR_INVALID_SIGNATURE', 401, {
				detail: 'Invalid HMAC signature'
			})
		);
	}

	return Ok(undefined);
}

interface TVerifyHmacSignatureConfig {
	/** Shared secret for HMAC verification */
	secret: string;
	/** Maximum age of request in milliseconds (default: 5 minutes) */
	maxAgeMs?: number;
}
