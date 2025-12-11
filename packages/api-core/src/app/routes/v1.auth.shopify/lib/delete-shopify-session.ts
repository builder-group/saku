import { eq } from 'drizzle-orm';
import { db, redisClient, shopifySessionTable } from '@/environment';

export async function deleteShopifySession(sessionId: string): Promise<void> {
	await redisClient.deleteShopifySession(sessionId);
	await db.delete(shopifySessionTable).where(eq(shopifySessionTable.sessionId, sessionId));
}
