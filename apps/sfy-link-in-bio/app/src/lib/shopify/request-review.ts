import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { appConfig, logger, shopifyClientConfig } from '@/environment';

/**
 * Request a review from the user through Shopify's review modal
 *
 * https://shopify.dev/docs/api/app-bridge-library/apis/reviews
 *
 * @param shopify AppBridge instance
 * @returns Promise that resolves when the request is complete
 */
export async function requestReview(shopify: ShopifyGlobal): Promise<boolean> {
	if (!appConfig.featureFlags.review || !canRequestReview()) {
		return false;
	}

	try {
		const result = await shopify.reviews.request();
		if (!result.success) {
			logger.info(`Review modal not displayed. Reason: (${result.code}) ${result.message}`);
			return false;
		}

		storeReviewRequest(Date.now());
		return true;
	} catch (error) {
		logger.error('Error requesting review:', error);
		return false;
	}
}

function getStoredReviewRequests(): number[] {
	try {
		const stored = localStorage.getItem(shopifyClientConfig.review.storageKey);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function storeReviewRequest(timestamp: number): void {
	try {
		const requests = getStoredReviewRequests();
		requests.push(timestamp);

		// Keep only last year
		const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
		const recent = requests.filter((req) => req > oneYearAgo);

		localStorage.setItem(shopifyClientConfig.review.storageKey, JSON.stringify(recent));
	} catch {
		// do nothing
	}
}

function canRequestReview(): boolean {
	const now = Date.now();
	const requests = getStoredReviewRequests();

	// Check cooldown
	const cooldownMs = shopifyClientConfig.review.cooldownDays * 24 * 60 * 60 * 1000;
	const recentRequest = requests.find((req) => req > now - cooldownMs);
	if (recentRequest) {
		return false;
	}

	// Check yearly limit
	const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
	const yearlyRequests = requests.filter((req) => req > oneYearAgo);
	return yearlyRequests.length < shopifyClientConfig.review.maxRequestsPerYear;
}
