import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { appConfig, logger } from '@/environment';

/**
 * Request a review from the user through Shopify's review modal
 *
 * https://shopify.dev/docs/api/app-bridge-library/apis/reviews
 *
 * @param shopify AppBridge instance
 * @returns Promise that resolves when the request is complete
 */
export async function requestReview(shopify: ShopifyGlobal): Promise<boolean> {
	if (!appConfig.featureFlags.requestReview) {
		logger.info('Review modal not displayed. Reason: Feature flag not enabled');
		return false;
	}

	try {
		const result = await shopify.reviews.request();
		if (!result.success) {
			logger.info(`Review modal not displayed. Reason: (${result.code}) ${result.message}`);
		}
		return result.success;
	} catch (error) {
		logger.error('Error requesting review:', error);
		return false;
	}
}
