import { AppError } from '@repo/hono-utils';
import { asc, desc, eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';

export async function getShopifyShopAccessToken(shopId: string): Promise<string> {
	const [session] = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopId))
		.orderBy(
			// Sort by isOnline first (false first), then by expiresAt descending
			asc(shopifySessionTable.isOnline),
			desc(shopifySessionTable.expiresAt)
		)
		.limit(1);

	if (session == null) {
		throw new AppError('#ERR_ACCESS_TOKEN_NOT_FOUND', 404, {
			detail: `No access token found for shop: ${shopId}`
		});
	}

	if (session.isOnline && session.expiresAt && new Date() >= session.expiresAt) {
		throw new AppError('#ERR_ACCESS_TOKEN_EXPIRED', 401, {
			detail: `Online access token has expired for shop: ${shopId}. Token expired at: ${session.expiresAt.toISOString()}`
		});
	}

	return session.accessToken;
}
