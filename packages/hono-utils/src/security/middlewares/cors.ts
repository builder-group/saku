import { getRootHostname, toArray } from '@blgc/utils';
import { Context, MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';

/**
 * CORS middleware with support for TLD checking
 * @example
 * ```ts
 * // Simple origin
 * app.use(corsMiddleware({
 *   origin: 'https://example.com'
 * }));
 *
 * // TLD checking
 * app.use(corsMiddleware({
 *   origin: { domain: 'example.com' }
 * }));
 *
 * // Multiple TLD configs
 * app.use(corsMiddleware({
 *   origin: [
 *     { domain: 'example.com' },
 *     { domain: 'api.com', fallback: 'https://api.com' }
 *   ]
 * }));
 * ```
 */
export function corsMiddleware(config: TCorsConfig): MiddlewareHandler {
	const { origin, ...corsConfig } = config;

	return cors({
		credentials: true,
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
		allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		exposeHeaders: ['Content-Length', 'X-Content-Type-Options'],
		maxAge: 600,
		...corsConfig,
		origin: createOriginHandler(origin)
	});
}

export function createOriginHandler(
	originConfig: TCorsOrigin
): (origin: string, c: Context) => string | undefined | null {
	if (typeof originConfig === 'function') {
		return originConfig;
	}
	const configs = toArray(originConfig);

	return (requestOrigin: string) => {
		for (const config of configs) {
			// String exact match
			if (typeof config === 'string') {
				if (config === requestOrigin) {
					return requestOrigin;
				}
				continue;
			}

			// Strategy-based matching
			switch (config.strategy) {
				case 'tld': {
					if (getRootHostname(config.domain) === getRootHostname(requestOrigin)) {
						return requestOrigin;
					}
					break;
				}
				case 'exact':
				default: {
					if (config.domain === requestOrigin) {
						return requestOrigin;
					}
				}
			}
		}

		return null;
	};
}

export interface TCorsConfig {
	/**
	 * Origin configuration - can be a simple string/array or advanced TLD checking
	 */
	origin: TCorsOrigin;
	/**
	 * Allow credentials (cookies, authorization headers)
	 * @default true
	 */
	credentials?: boolean;
	/**
	 * Allowed HTTP methods
	 * @default ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
	 */
	allowMethods?: string[];
	/**
	 * Allowed HTTP headers
	 * @default ['Content-Type', 'Authorization', 'X-Requested-With']
	 */
	allowHeaders?: string[];
	/**
	 * Headers exposed to the client
	 * @default ['Content-Length', 'X-Content-Type-Options']
	 */
	exposeHeaders?: string[];
	/**
	 * Cache duration for preflight requests in seconds
	 * @default 600 (10 minutes)
	 */
	maxAge?: number;
}

export type TCorsOrigin =
	| string
	| TCorsOriginWithMatchStrategy
	| (TCorsOriginWithMatchStrategy | string)[]
	| ((origin: string, c: Context) => string | undefined | null);

export interface TCorsOriginWithMatchStrategy {
	/**
	 * Domain for matching
	 * @example 'example.com' matches 'api.example.com' if tld is true
	 */
	domain: string;
	/**
	 * Matching strategy
	 * @default 'exact'
	 */
	strategy?: TCorsOriginMatchStrategy;
}

export type TCorsOriginMatchStrategy = 'exact' | 'tld';
