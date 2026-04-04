import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyClientConfig, shopifyStorefrontApiClient } from '@/environment';
import { AppError } from '@/lib/AppError';

const SHOP_CURRENCY = gql(`
	query shopCurrency {
		paymentSettings {
			currencyCode
		}
	}
`);

export async function getShopCurrencyCode(
	config: TGetShopCurrencyCodeConfig
): Promise<TResult<string, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyStorefrontApiClient.query(SHOP_CURRENCY, {
		prefixUrl: shopifyClientConfig.shop.storefrontApi(shopId),
		headers: {
			'X-Shopify-Storefront-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const currencyCode = result.value.data.paymentSettings?.currencyCode;
	if (currencyCode == null) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', {
				detail: 'Shopify storefront did not return a currency code'
			})
		);
	}

	return Ok(currencyCode);
}

interface TGetShopCurrencyCodeConfig {
	shopId: string;
	accessToken: string;
}
