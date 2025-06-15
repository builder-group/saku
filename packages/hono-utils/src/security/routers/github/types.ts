import type { TGithubUser } from '@repo/types/github';
import type { GitHub, OAuth2Tokens } from 'arctic';
import type { Context } from 'hono';

export interface TGithubOAuthConfig<GUpdateUserResult = void, GDestorySessionResult = void> {
	/** GitHub OAuth client instance */
	client: GitHub;
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
		data: { githubUser: TGithubUserWithPrimaryEmail; tokens: OAuth2Tokens }
	) => Promise<GUpdateUserResult>;
	/**
	 * Create a session for the authenticated user
	 */
	createSession: (
		c: Context,
		data: { githubUser: TGithubUserWithPrimaryEmail; updateUserResult: GUpdateUserResult }
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
			data: { githubUser: TGithubUserWithPrimaryEmail; updateUserResult: GUpdateUserResult }
		) => Promise<void>;
		/** Called when authentication fails */
		onLoginFailed?: (
			c: Context,
			data: {
				githubUser?: TGithubUserWithPrimaryEmail;
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
export interface TGithubOAuthState {
	csrf: string;
	callbackUrl: string;
}

export type TGithubUserWithPrimaryEmail = TGithubUser & {
	primary_email: {
		verified: boolean;
		email: string;
	};
};
