import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	// Public-facing and URL-friendly user handle/slug (e.g. username)
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

export const userAccountTable = pgTable(
	'user_account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),

		// Type of account (e.g. oauth, oidc, otp)
		accountType: text('account_type').$type<TAccountType>().notNull(),

		// Provider name (e.g. github, google, email)
		provider: text('provider').$type<TProviderType>().notNull(),
		// Provider's unique identifier for this user (e.g. UUID for GitHub, Email for OTP)
		providerAccountId: text('provider_account_id').notNull(),
		// Raw provider data
		// Note: Using `jsonb` to keep schema minimal, avoid column bloat, and support flexible future providers.
		// We likely won't need to query provider-specific fields directly - instead, we can query by provider and extract what's needed.
		// Tradeoff: Can't select or filter by nested fields at the SQL level.
		providerData: jsonb('provider_data').$type<TProviderData>(),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]
);

export type TAccountType = 'oauth' | 'oidc' | 'otp' | 'webauthn';

export type TProviderType = 'github' | 'google' | 'atproto' | 'email';

export type TProviderData = TGitHubProviderData | TGoogleProviderData | TEmailOTPProviderData;

/**
 * Email OTP Provider Data
 */
export interface TEmailOTPProviderData {}

/**
 * GitHub OAuth Provider Data
 */
export interface TGitHubProviderData {
	accessToken: string; // OAuth 2.0 access token
	tokenType: string; // Typically "bearer"
	scopes?: string[]; // Scopes granted by GitHub (e.g., "user:email")
}

/**
 * Google OAuth + OIDC Provider Data
 */
export interface TGoogleProviderData {
	accessToken: string; // OAuth 2.0 access token
	tokenType: string; // Typically "bearer"
	scopes?: string[]; // Granted scopes (e.g., "openid email profile")
	expiresAt: string; // Access token expiry in ISO format
	idToken: string; // JWT with user claims (OpenID Connect)
}
