import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable } from '@/environment/db';
import { parseSessionId } from './parse-session-id';

export async function deleteShopifySession(sessionId: string): Promise<void> {
	// Extract shop domain from session ID
	const sessionData = parseSessionId(sessionId);
	if (sessionData == null) {
		throw new AppError('#ERR_INVALID_SESSION_ID', 400, {
			detail: 'Invalid session ID format'
		});
	}
	const { shopDomain: providerAccountId } = sessionData;

	const deleted = await db
		.delete(shopAccountTable)
		.where(
			and(
				eq(shopAccountTable.provider, 'shopify'),
				eq(shopAccountTable.providerAccountId, providerAccountId)
			)
		)
		.returning({ id: shopAccountTable.userId });

	if (!deleted.length) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}
}
