import type { Google, OAuth2Tokens } from 'arctic';
import type { Context } from 'hono';

export interface TGoogleOAuthConfig<GUpdateUserResult = void, GDestorySessionResult = void> {
	/** Google OAuth client instance */
	client: Google;
	/** OAuth scopes to request */
	scope: string[];
	/** Base URL of the API */
	apiUrl: string;
	/** Whether to redirect errors to callback URL (default: true) */
	redirectCallbackErrors?: boolean;
	/**
	 * Update or create user in your system
	 */
	updateUser: (
		c: Context,
		data: { googleClaims: TGoogleClaims; tokens: OAuth2Tokens }
	) => Promise<GUpdateUserResult>;
	/**
	 * Create a session for the authenticated user
	 */
	createSession: (
		c: Context,
		data: { googleClaims: TGoogleClaims; updateUserResult: GUpdateUserResult }
	) => Promise<void>;
	/**
	 * Destroy the current session
	 */
	destroySession: (c: Context) => Promise<GDestorySessionResult>;
	hooks?: {
		/** Called before starting OAuth flow */
		onLoginStart?: (c: Context, data: { callbackUrl: string }) => Promise<void>;
		/** Called after successful user authentication */
		onLoginSuccess?: (
			c: Context,
			data: { googleClaims: TGoogleClaims; updateUserResult: GUpdateUserResult }
		) => Promise<void>;
		/** Called when authentication fails */
		onLoginFailed?: (
			c: Context,
			data: {
				googleClaims?: TGoogleClaims;
				error: Error;
			}
		) => Promise<void>;
		/** Called before starting logout flow */
		onLogoutStart?: (c: Context) => Promise<void>;
		/** Called after successful logout */
		onLogoutSuccess?: (
			c: Context,
			data: { destorySessionResult: GDestorySessionResult }
		) => Promise<void>;
		/** Called when logout fails */
		onLogoutFailed?: (c: Context, data: { error: Error }) => Promise<void>;
	};
}

/** State data stored during OAuth flow */
export interface TGoogleOAuthState {
	csrf: string;
	callbackUrl: string;
}

export interface TGoogleClaims extends Record<string, any> {
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name?: string;
	given_name: string;
	hd?: string;
	iat: number;
	iss: string;
	jti?: string;
	locale?: string;
	name: string;
	nbf?: number;
	picture: string;
	sub: string;
}
