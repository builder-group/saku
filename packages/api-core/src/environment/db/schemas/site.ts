import { foreignKey, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';

/**
 * Core site data and content, owned by users.
 * Represents a web presence with a unique handle and content.
 */
export const siteTable = pgTable('site', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	// Owner of the site
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	// Public-facing and URL-friendly user handle/slug (e.g. /bio, /shop)
	handle: text('handle').unique().notNull(),
	// Human-friendly site name
	displayName: text('display_name'),

	// Site content
	content: jsonb('content').$type<Record<string, unknown>>().notNull(),

	// Publishing status
	// isPublished: text('is_published')
	// 	.$type<boolean>()
	// 	.$default(() => false),
	// publishedAt: timestamp('published_at', { mode: 'date' }),

	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

/**
 * Provider accounts connected to sites (e.g. Shopify stores).
 */
export const siteAccountTable = pgTable(
	'site_account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),

		// Account type (e.g. oauth for Shopify)
		accountType: text('account_type').$type<TSiteAccountType>().notNull(),

		// Provider info (e.g. shopify, woocommerce)
		provider: text('provider').$type<TSiteProviderType>().notNull(),
		// Provider's unique identifier (e.g. shop domain for Shopify)
		providerAccountId: text('provider_account_id').notNull(),
		// Raw provider data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		providerData: jsonb('provider_data').$type<TSiteProviderData>(),

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
 * Links sites to provider accounts, enabling many-to-many relationships.
 * One site can connect to multiple providers and vice versa.
 */
export const siteConnectionTable = pgTable(
	'site_connection',
	{
		siteId: text('site_id')
			.notNull()
			.references(() => siteTable.id, { onDelete: 'cascade' }),

		// Provider account info
		provider: text('provider').$type<TSiteProviderType>().notNull(),
		providerAccountId: text('provider_account_id').notNull(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		primaryKey({ columns: [table.siteId, table.provider, table.providerAccountId] }),
		foreignKey({
			columns: [table.provider, table.providerAccountId],
			foreignColumns: [siteAccountTable.provider, siteAccountTable.providerAccountId],
			name: 'fk_site_connection_site_account'
		}).onDelete('cascade')
	]
);

export type TSiteAccountType = 'oauth' | 'oidc' | 'otp' | 'webauthn';
export type TSiteProviderType = 'shopify';
export type TSiteProviderData = TShopifySiteProviderData;

/**
 * Shopify Provider Data
 *
 * Note: OAuth data (access tokens, scopes, etc.) is stored in the ShopifySessionTable
 * because offline sessions might arrive before shop accounts exist (no user data)
 * and one shop account might have multiple active sessions (online + offline).
 */
interface TShopifySiteProviderData {
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
