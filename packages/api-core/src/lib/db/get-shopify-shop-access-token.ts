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

	return providerData.accessToken;
}
