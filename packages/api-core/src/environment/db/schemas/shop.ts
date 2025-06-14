import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { TAccountType, userTable } from './user';

export const shopAccountTable = pgTable(
	'shop_account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),

		// Type of account (oauth for most e-commerce providers)
		accountType: text('account_type').$type<TAccountType>().notNull(),

		// Provider name (shopify, woocommerce, square, etc.)
		provider: text('provider').$type<TShopProviderType>().notNull(),
		// Provider's unique identifier for this shop (e.g. "my-store.myshopify.com" for Shopify)
		providerAccountId: text('provider_account_id').notNull(),
		// Raw provider data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		providerData: jsonb('provider_data').$type<TShopProviderData>(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]
);

/**
 * Shopify Session Table
 *
 * Stores sessions separately from shop accounts because offline sessions may arrive
 * before shop accounts exist (no user data). Online sessions create accounts later.
 *
 * No foreign key constraints - offline sessions would violate them during creation.
 * Cascade deletion handled programmatically via deleteShopAccount().
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

export type TShopProviderType = 'shopify';

export type TShopProviderData = TShopifyProviderData;

/**
 * Shopify Provider Data
 */
export interface TShopifyProviderData {
	// Installer info from online session (person who installed the app)
	installer?: {
		shopifyId: string; // e.g. "987654321"
		email: string; // e.g. "john@coffeeshop.com"
		firstName: string; // e.g. "John"
		lastName: string; // e.g. "Doe"
		isOwner: boolean; // e.g. true (account_owner from Shopify)
		emailVerified: boolean; // e.g. true
		locale: string; // e.g. "en-US"
		isCollaborator: boolean; // e.g. false
	};
}
