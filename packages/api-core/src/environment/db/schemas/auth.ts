import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Shopify OAuth sessions, supporting both online and offline access modes.
 *
 * Note: Stores sessions separately from shop accounts because offline sessions might arrive
 * before shop accounts exist (no user data). Arrival of online session will create shop account later.
 *
 * Note: No foreign key constraints - offline sessions would violate them during creation.
 * Cascade deletion handled programmatically.
 */
export const shopifySessionTable = pgTable('shopify_session', {
	// Session ID (e.g. "offline_my-shop.myshopify.com", "my-shop.myshopify.com_123456")
	sessionId: text('session_id').primaryKey(),

	// Shop domain (e.g. "my-shop.myshopify.com")
	shopId: text('shop_id').notNull(),

	// Session type
	isOnline: text('is_online').$type<boolean>().notNull(),

	// OAuth data
	accessToken: text('access_token').notNull(),
	scopes: text('scopes').notNull(),
	state: text('state').notNull(),

	// Additional session metadata
	sessionData: jsonb('session_data').$type<TShopifySessionData>(),

	// Online sessions have expiry, offline sessions don't
	expiresAt: timestamp('expires_at', { mode: 'date' }),

	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

export interface TShopifySessionData {
	// Online session user info (when available)
	//
	// Note: This is not the same as the associated app user in the ShopAccountTable.
	// This is the Shopify user that is associated with the session.
	//
	// https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/session-storage/shopify-app-session-storage-prisma/src/prisma.ts
	onlineAccessInfo?: {
		associatedUser: {
			id: number;
			firstName: string;
			lastName: string;
			email: string;
			emailVerified: boolean;
			accountOwner: boolean;
			locale: string;
			collaborator: boolean;
		};
		associatedUserScope?: string;
		expiresIn?: number;
		session?: string;
		accountNumber?: number;
	};

	[key: string]: unknown;
}
