import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';

/**
 * Gets the offline access token for a shop.
 * This is the default token used for most operations.
 * Offline tokens never expire and are always available.
 */
export async function getShopifyOfflineAccessToken(
	shopId: string
): Promise<TResult<string, AppError>> {
	const [session] = await db
		.select()
		.from(shopifySessionTable)
		.where(and(eq(shopifySessionTable.shopId, shopId), eq(shopifySessionTable.isOnline, false)))
		.limit(1);
	if (session == null) {
		return Err(
			new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
				detail: `No offline access token found for shop: ${shopId}`
			})
		);
	}

	return Ok(session.accessToken);
}
