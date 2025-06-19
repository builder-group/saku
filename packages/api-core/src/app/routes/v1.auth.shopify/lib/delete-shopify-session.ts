import { eq } from 'drizzle-orm';
import { db, shopifySessionTable } from '@/environment/db';

export async function deleteShopifySession(sessionId: string): Promise<void> {
	await db.delete(shopifySessionTable).where(eq(shopifySessionTable.sessionId, sessionId));
}
