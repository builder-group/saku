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

/**
 * Provider accounts connected to workspaces (e.g. Shopify stores).
 */
export const workspaceAccountTable = pgTable(
	'workspace_account',
	{
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspaceTable.id, { onDelete: 'cascade' }),

		// Account type (e.g. oauth for Shopify)
		accountType: text('account_type').$type<TWorkspaceAccountType>().notNull(),

		// Provider name (e.g. "shopify", "woocommerce")
		provider: text('provider').$type<TWorkspaceProviderType>().notNull(),
		// Provider's unique identifier (e.g. shop domain for Shopify)
		providerAccountId: text('provider_account_id').notNull(),
		// Raw provider data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		providerData: jsonb('provider_data').$type<TWorkspaceProviderData>(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.workspaceId, table.provider, table.providerAccountId] })]
);

export type TWorkspaceRole = 'owner' | 'admin' | 'member';

export type TWorkspaceAccountType = 'oauth' | 'oidc' | 'otp' | 'webauthn';
export type TWorkspaceProviderType = 'shopify';
export type TWorkspaceProviderData = TShopifyWorkspaceProviderData;

/**
 * Shopify Workspace Provider Data
 */
interface TShopifyWorkspaceProviderData {
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
