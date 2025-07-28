import crypto from 'node:crypto';
import { TRequestMiddleware } from 'feature-fetch';

/**
 * Creates a HMAC authentication middleware for feature-fetch requests.
 *
 * This middleware automatically adds HMAC signatures to requests
 * for server-to-server authentication.
 *
 * @param config - HMAC configuration
 * @returns Request middleware function
 */
export function createHmacMiddleware(config: THmacConfig): TRequestMiddleware {
	const { secret } = config;

	return (next) => {
		return async (input, init) => {
			// Parse request details
			const url = new URL(input.toString());
			const method = init?.method || 'GET';
			const path = url.pathname;
			const body = init?.body || null;

			// Generate HMAC signature
			const timestamp = Date.now();
			const bodyStr = body == null ? '' : typeof body === 'string' ? body : JSON.stringify(body);
			const payload = `${timestamp}.${method.toUpperCase()}.${path}.${bodyStr}`;

			const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

			// Add HMAC headers
			const headers = new Headers(init?.headers);
			headers.set('Authorization', `HMAC ${signature}`);
			headers.set('X-Timestamp', timestamp.toString());
			headers.set('Content-Type', 'application/json');

			return next(input, { ...init, headers });
		};
	};
}

export interface THmacConfig {
	/** Shared secret for HMAC signing */
	secret: string;
}
