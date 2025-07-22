import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';

/**
 * Workspaces represent a business context (e.g. a Shopify store, agency client).
 */
export const workspaceTable = pgTable('workspace', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	// URL-friendly workspace handle (e.g. "bennos-studio")
	handle: text('handle').unique().notNull(),
	// Human-friendly workspace name
	displayName: text('display_name'),
	// Workspace logo/image URL
	image: text('image'),

	// When workspace onboarding was completed (null = needs onboarding)
	onboardingCompletedAt: timestamp('onboarding_completed_at', { mode: 'date' }),

	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

/**
 * User membership in workspaces with roles.
 */
export const workspaceMemberTable = pgTable(
	'workspace_member',
	{
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspaceTable.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			// Prevent user deletion if still workspace member (to prevent dead workspaces without owners)
			.references(() => userTable.id, { onDelete: 'restrict' }),

		// Member role (e.g. "owner", "admin", "member")
		role: text('role').$type<TWorkspaceRole>().notNull(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.workspaceId, table.userId] })]
);

export type TWorkspaceRole = 'owner' | 'admin' | 'member';

/**
 * Provider accounts connected to workspaces (e.g. Shopify stores).
 */
export const workspaceAccountTable = pgTable(
	'workspace_account',
	{
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspaceTable.id, { onDelete: 'cascade' }),

		// Provider name (e.g. "shopify", "woocommerce")
		provider: text('provider').$type<TWorkspaceProviderType>().notNull(),
		// Provider's unique identifier (e.g. shop domain for Shopify)
		providerAccountId: text('provider_account_id').notNull(),

		// Account type (e.g. oauth for Shopify)
		accountType: text('account_type').$type<TWorkspaceAccountType>().notNull(),
		// Raw account data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		accountData: jsonb('account_data').$type<TWorkspaceAccountData>(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.workspaceId, table.provider, table.providerAccountId] })]
);

export type TWorkspaceAccountType = 'oauth';
export type TWorkspaceProviderType = 'shopify';
export type TWorkspaceAccountData = TShopifyWorkspaceAccountData;

/**
 * Shopify Workspace Account Data
 */
export interface TShopifyWorkspaceAccountData {
	// Installer information (person who installed the app)
	installer?: {
		shopifyId: string;
		email: string;
		firstName: string;
		lastName: string;
		isOwner: boolean;
		emailVerified: boolean;
		locale: string;
		isCollaborator: boolean;
	};
}

/**
 * Workspace tokens for various API integrations and services.
 */
export const workspaceTokenTable = pgTable(
	'workspace_token',
	{
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspaceTable.id, { onDelete: 'cascade' }),

		// Provider name (e.g. "shopify")
		provider: text('provider').$type<TWorkspaceTokenProvider>().notNull(),
		// Provider's unique token identifier (e.g. Shopify ID for storefront token)
		providerTokenId: text('provider_token_id').notNull(),

		// Token type (e.g. storefront)
		tokenType: text('token_type').$type<TWorkspaceTokenType>().notNull(),
		// Raw token data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		tokenData: jsonb('token_data').$type<TWorkspaceTokenData>(),

		// Token lifecycle
		lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
		expiresAt: timestamp('expires_at', { mode: 'date' }),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.workspaceId, table.provider, table.providerTokenId] })]
);

export type TWorkspaceTokenType = 'storefront';
export type TWorkspaceTokenProvider = 'shopify';
export type TWorkspaceTokenData = TShopifyStorefrontWorkspaceTokenData;

/**
 * Shopify Storefront Workspace Token Data
 */
export interface TShopifyStorefrontWorkspaceTokenData {
	title: string;
	accessToken: string;
	accessScopes: string[];
}
