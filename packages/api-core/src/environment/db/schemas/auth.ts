import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Shopify Session Table
 *
 * Note: Stores sessions separately from shop accounts because offline sessions may arrive
 * before shop accounts exist (no user data). Online sessions create accounts later.
 *
 * Note: No foreign key constraints - offline sessions would violate them during creation.
 * Cascade deletion handled programmatically.
 */
export const shopifySessionTable = pgTable('shopify_session', {
	// Session ID (e.g. "offline_my-shop.myshopify.com" or "my-shop.myshopify.com_123456")
	sessionId: text('session_id').primaryKey(),

	// Shop domain (e.g. "my-shop.myshopify.com")
	shopId: text('shop_id').notNull(),

	// Session type
	isOnline: text('is_online').$type<boolean>().notNull(),

	// OAuth data
	accessToken: text('access_token').notNull(),
	scopes: text('scopes').notNull(),
	state: text('state').notNull(),
	// Online sessions have expiry, offline sessions don't
	expiresAt: timestamp('expires_at', { mode: 'date' }),

	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});
