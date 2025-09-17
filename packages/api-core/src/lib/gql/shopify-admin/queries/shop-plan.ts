import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/shop
export const SHOP_PLAN = gql(`
	query shopPlan {
		shop {
			id
			plan {
				partnerDevelopment
				publicDisplayName
				shopifyPlus
			}
		}
	}
`);

export async function getShopPlan(
	config: TGetShopPlanConfig
): Promise<TResult<TGetShopPlanSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(SHOP_PLAN, {
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

	if (shop.plan == null) {
		return Err(
			new AppError('#ERR_SHOP_PLAN_NOT_FOUND', 404, {
				detail: 'Shop plan not found'
			})
		);
	}

	return Ok({
		id: shop.id,
		plan: {
			displayName: shop.plan.publicDisplayName,
			isPartnerDevelopment: shop.plan.partnerDevelopment,
			isShopifyPlus: shop.plan.shopifyPlus
		}
	});
}

interface TGetShopPlanConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetShopPlanSuccess {
	id: string;
	plan: {
		displayName: string;
		isPartnerDevelopment: boolean;
		isShopifyPlus: boolean;
	};
}
