import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Core user data and profile information.
 */
export const userTable = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	// URL-friendly user handle (e.g. "bennobuilder")
	handle: text('handle').unique().notNull(),
	// Human-friendly user name
	displayName: text('display_name'),
	// User logo/image URL
	image: text('image'),

	// Email address
	email: text('email').unique(),
	// When the email was verified (if not verified, the timestamp is null)
	emailVerifiedAt: timestamp('email_verified_at', { mode: 'date' }),

	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
});

/**
 * User authentication accounts and provider connections.
 */
export const userAccountTable = pgTable(
	'user_account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),

		// Provider name (e.g. "github", "google", "email")
		provider: text('provider').$type<TUserProviderType>().notNull(),
		// Provider's unique identifier for this user (e.g. UUID for GitHub, Email for OTP)
		providerAccountId: text('provider_account_id').notNull(),

		// Type of account (e.g. "oauth", "oidc", "otp")
		accountType: text('account_type').$type<TUserAccountType>().notNull(),
		// Raw account data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		accountData: jsonb('account_data').$type<TUserAccountData>(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.userId, table.provider, table.providerAccountId] })]
);

export type TUserAccountType = 'oauth' | 'oidc' | 'otp' | 'webauthn';
export type TUserProviderType = 'github' | 'google' | 'atproto' | 'email';
export type TUserAccountData =
	| TGitHubUserAccountData
	| TGoogleUserAccountData
	| TEmailOTPUserAccountData;

/**
 * Email OTP User Account Data
 */
export interface TEmailOTPUserAccountData {}

/**
 * GitHub OAuth User Account Data
 */
export interface TGitHubUserAccountData {
	accessToken: string; // OAuth 2.0 access token
	tokenType: string; // Typically "bearer"
	scopes?: string[]; // Scopes granted by GitHub (e.g., "user:email")
}

/**
 * Google OAuth + OIDC User Account Data
 */
export interface TGoogleUserAccountData {
	accessToken: string; // OAuth 2.0 access token
	tokenType: string; // Typically "bearer"
	scopes?: string[]; // Granted scopes (e.g., "openid email profile")
	expiresAt: string; // Access token expiry in ISO format
	idToken: string; // JWT with user claims (OpenID Connect)
}
