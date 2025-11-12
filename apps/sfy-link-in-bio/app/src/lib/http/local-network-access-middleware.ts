import type { TFetchLike } from 'feature-fetch';
import { logger } from '@/environment';

/**
 * Middleware for Local Network Access (LNA) in Chrome 142+.
 * Logs warning if local network request fails (likely LNA blocking).
 * https://developer.chrome.com/blog/local-network-access
 *
 * TODO: Figure out how to make Local Network Access work from Cloudflare tunnel without disabling the entire feature.
 */
export function localNetworkAccessMiddleware(next: TFetchLike): TFetchLike {
	return async (url, init) => {
		const urlString = typeof url === 'string' ? url : url.toString();
		const isLocalNetwork =
			urlString.includes('localhost') ||
			urlString.includes('127.0.0.1') ||
			urlString.includes('::1') ||
			urlString.includes('.local');

		if (!isLocalNetwork) {
			return next(url, init);
		}

		try {
			return await next(url, init);
		} catch (error) {
			logger.warn(
				'Local Network Access may be blocking requests to localhost. Disable it in Chrome: chrome://flags/#local-network-access-check',
				{ error }
			);
			throw error;
		}
	};
}
