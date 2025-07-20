import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/shop
export const SHOP_INFO = gql(`
	query shopInfo {
		shop {
			id
			name
			myshopifyDomain
			description
			email
			contactEmail
			currencyCode
			ianaTimezone
			shipsToCountries
			primaryDomain {
				host
				url
			}
			plan {
				displayName
				shopifyPlus
			}
		}
	}
`);

export async function getShopInfo(
	config: TGetShopInfoConfig
): Promise<TResult<TGetShopInfoSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(SHOP_INFO, {
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
		name: shop.name,
		domain: shop.myshopifyDomain,
		description: shop.description ?? undefined,
		currency: shop.currencyCode,
		country: shop.shipsToCountries?.[0] ?? undefined,
		email: shop.email,
		contactEmail: shop.contactEmail,
		timezone: shop.ianaTimezone,
		primaryDomain: shop.primaryDomain
			? {
					host: shop.primaryDomain.host,
					url: shop.primaryDomain.url
				}
			: undefined,
		plan: shop.plan
			? {
					displayName: shop.plan.displayName,
					shopifyPlus: shop.plan.shopifyPlus
				}
			: undefined
	});
}

interface TGetShopInfoConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetShopInfoSuccess {
	id: string;
	name: string;
	domain: string;
	description?: string;
	currency: string;
	country?: string;
	email: string;
	contactEmail: string;
	timezone: string;
	primaryDomain?: {
		host: string;
		url: string;
	};
	plan?: {
		displayName: string;
		shopifyPlus: boolean;
	};
}
