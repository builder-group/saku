import { type coreApiV1 } from '@repo/types/api';
import {
	createFetchClient,
	createOpenApiFetchClient,
	TFetchLike,
	withGraphQL
} from 'feature-fetch';
import { apiClientConfig, appConfig } from '../configs';
import { logger } from '../logger';

export const coreApiClient = createOpenApiFetchClient<coreApiV1.paths>({
	prefixUrl: apiClientConfig.core.url,
	requestMiddlewares:
		appConfig.env === 'local' || appConfig.env === 'development'
			? [localNetworkAccessMiddleware]
			: []
});

export const shopifyStorefrontApiClient = withGraphQL(
	createFetchClient({
		prefixUrl: '' // Prefix URL is defined per request (https://shopify.dev/docs/api/storefront/latest)
	})
);

/**
 * Middleware for Local Network Access (LNA) in Chrome 142+.
 * Checks permission status and logs instructions to disable the feature if needed.
 *
 * https://developer.chrome.com/blog/local-network-access
 *
 * TODO: Figure out how to make Local Network Access work (from Cloudflare tunnel) without disabling the entire feature.
 */
function localNetworkAccessMiddleware(next: TFetchLike): TFetchLike {
	let permissionChecked = false;

	async function checkPermission() {
		// Only check on client side (browser)
		if (typeof window === 'undefined' || typeof navigator === 'undefined') {
			return;
		}

		if (permissionChecked) {
			return;
		}
		permissionChecked = true;

		try {
			const result = await navigator.permissions.query({
				// @ts-expect-error - local-network-access is a new permission in Chrome 142+
				name: 'local-network-access'
			});
			const state = result.state;

			if (state === 'denied' || state === 'prompt') {
				logger.warn(
					'Local Network Access is blocking requests to localhost. To fix this, disable the Local Network Access feature in Chrome:',
					{
						instructions: [
							'1. Go to chrome://flags/#local-network-access-check',
							'2. Set "Local Network Access Checks" to "Disabled"',
							'3. Restart Chrome',
							'',
							'For more information, see: https://developer.chrome.com/blog/local-network-access'
						].join('\n'),
						permissionState: state
					}
				);
			}
		} catch {
			// Permission API not available - likely not Chrome 142+ or feature not enabled
			logger.debug('Local Network Access permission API not available');
		}
	}

	return async (url, init) => {
		// Check if URL is localhost/127.0.0.1
		const urlString = typeof url === 'string' ? url : url.toString();
		const isLocalNetwork =
			urlString.includes('localhost') ||
			urlString.includes('127.0.0.1') ||
			urlString.includes('::1') ||
			urlString.includes('.local');

		if (isLocalNetwork) {
			// Check permission status (non-blocking)
			void checkPermission();
		}

		return next(url, init);
	};
}
