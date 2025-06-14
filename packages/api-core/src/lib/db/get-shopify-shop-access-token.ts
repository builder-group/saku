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

	// Prefer offline token (never expires) over online token (expires every 24h)
	if (providerData?.offlineSession?.accessToken) {
		return providerData.offlineSession.accessToken;
	}

	// Fallback to online token if offline not available
	if (providerData?.onlineSession?.accessToken) {
		const expiryDate = new Date(providerData.onlineSession.expiresAt);
		const now = new Date();

		if (now >= expiryDate) {
			throw new AppError('#ERR_ACCESS_TOKEN_EXPIRED', 401, {
				detail: `Online access token has expired for shop: ${shopId}. Token expired at: ${providerData.onlineSession.expiresAt}`
			});
		}

		return providerData.onlineSession.accessToken;
	}

	throw new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
		detail: `No access token found for shop: ${shopId}`
	});
}
