import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { coreApiClient } from '@/environment';
import { createShopifyTokenMiddleware } from '@/lib';

/**
 * Fetches URL metadata from the API
 */
export async function fetchUrlMetadata(
	url: string,
	shopify: ShopifyGlobal
): Promise<TUrlMetadata | null> {
	const result = await coreApiClient.get('/v1/url/metadata', {
		queryParams: { url },
		requestMiddlewares: [createShopifyTokenMiddleware(shopify)]
	});
	if (result.isErr()) {
		return null;
	}

	const urlMetadata = result.value.data;
	return {
		title: urlMetadata.title,
		description: urlMetadata.description,
		favicon: urlMetadata.icons?.favicon
	};
}

export interface TUrlMetadata {
	title?: string;
	description?: string;
	favicon?: string;
}
