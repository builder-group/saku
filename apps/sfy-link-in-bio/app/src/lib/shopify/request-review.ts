import { ShopifyGlobal } from '@shopify/app-bridge-react';

/**
 * Request a review from the user through Shopify's review modal
 * @param shopify AppBridge instance
 * @returns Promise that resolves when the request is complete
 */
export async function requestReview(shopify: ShopifyGlobal) {
	try {
		const result = await shopify.reviews.request();
		if (!result.success) {
			console.log(`Review modal not displayed. Reason: (${result.code}) ${result.message}`);
		}
		return result.success;
	} catch (error) {
		console.error('Error requesting review:', error);
		return false;
	}
}
