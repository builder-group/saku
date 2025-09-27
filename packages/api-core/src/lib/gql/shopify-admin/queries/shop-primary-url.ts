import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/shop
export const SHOP_PRIMARY_URL = gql(`
	query shopPrimaryUrl {
		shop {
			id
			primaryDomain {
				host
				url
			}
		}
	}
`);

export async function getShopPrimaryUrl(
	config: TGetShopPrimaryUrlConfig
): Promise<TResult<TGetShopPrimaryUrlSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(SHOP_PRIMARY_URL, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		headers: {
			'X-Shopify-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const shop = result.value.data['shop'];
	if (shop == null) {
		return Err(
			new AppError('#ERR_SHOP_NOT_FOUND', 404, {
				detail: 'Shop not found'
			})
		);
	}

	return Ok({
		id: shop.id,
		primaryDomain: shop.primaryDomain
			? {
					host: shop.primaryDomain.host,
					url: shop.primaryDomain.url
				}
			: null
	});
}

interface TGetShopPrimaryUrlConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetShopPrimaryUrlSuccess {
	id: string;
	primaryDomain: {
		host: string;
		url: string;
	} | null;
}
