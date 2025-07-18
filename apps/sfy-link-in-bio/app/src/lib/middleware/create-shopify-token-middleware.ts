import { TRequestMiddleware } from 'feature-fetch';

/**
 * Creates a Shopify ID token middleware for feature-fetch requests.
 *
 * This middleware automatically adds Shopify ID tokens to requests
 * for authenticated API calls. Accepts either a raw token string
 * or a ShopifyGlobal instance that will fetch the token automatically.
 *
 * @param tokenOrShopify - Either a raw ID token string or ShopifyGlobal instance
 * @returns Request middleware function
 */
export function createShopifyTokenMiddleware(
	tokenOrShopify: string | ShopifyGlobal
): TRequestMiddleware {
	return (next) => {
		return async (input, init) => {
			const idToken =
				typeof tokenOrShopify === 'string' ? tokenOrShopify : await tokenOrShopify.idToken();

			// Add Authorization header
			const headers = new Headers(init?.headers);
			headers.set('Authorization', `Bearer ${idToken}`);

			return next(input, { ...init, headers });
		};
	};
}

interface ShopifyGlobal {
	idToken(): Promise<string>;
}
