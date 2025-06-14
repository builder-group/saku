import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable } from '@/environment/db';
import type { TShopifyProviderData } from '@/environment/db/schemas/shop';

export async function getShopifyShopAccessToken(shopId: string): Promise<string> {
	const shops = await db
		.select({
			providerData: shopAccountTable.providerData
		})
		.from(shopAccountTable)
		.where(
			and(eq(shopAccountTable.provider, 'shopify'), eq(shopAccountTable.providerAccountId, shopId))
		)
		.limit(1);

	if (!shops.length) {
		throw new AppError('#ERR_SHOP_NOT_FOUND', 404, {
			detail: `Shop not found: ${shopId}`
		});
	}

	const providerData = shops[0]?.providerData as TShopifyProviderData;
	if (!providerData?.accessToken) {
		throw new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
			detail: `Access token not found for shop: ${shopId}`
		});
	}

	// Check if we have an access token that might be expired
	if (providerData.expiresAt != null) {
		const expiryDate = new Date(providerData.expiresAt);
		const now = new Date();

		if (now >= expiryDate) {
			throw new AppError('#ERR_ACCESS_TOKEN_EXPIRED', 401, {
				detail: `Online access token has expired for shop: ${shopId}. Please reinstall the app or use offline token.`
			});
		}
	}

	return providerData.accessToken;
}
