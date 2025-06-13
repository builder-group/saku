import { extractErrorData, getRootHostname } from '@blgc/utils';
import { OpenAPIHono } from '@hono/zod-openapi';
import { githubApiV1 } from '@repo/types/github';
import { generateState, OAuth2Tokens } from 'arctic';
import { createOpenApiFetchClient } from 'feature-fetch';
import { getCookie, setCookie } from 'hono/cookie';
import { AppError } from '@/error';
import { validationHook } from '@/openapi';
import {
	GetGithubOAuthCallbackRoute,
	GetGithubOAuthLoginRoute,
	PostGithubOAuthLogoutRoute
} from './schema';
import type { TGithubOAuthConfig, TGithubOAuthState, TGithubUserWithPrimaryEmail } from './types';

export function createGithubOAuthRouter<GUpdateUserResult = void, GDestorySessionResult = void>(
	config: TGithubOAuthConfig<GUpdateUserResult, GDestorySessionResult>
): OpenAPIHono {
	const {
		client,
		scope,
		apiUrl,
		updateUser,
		createSession,
		destroySession,
		hooks = {},
		redirectCallbackErrors = true
	} = config;

	const {
		onLoginSuccess,
		onLoginFailed,
		onLoginStart,
		onLogoutStart,
		onLogoutSuccess,
		onLogoutFailed
	} = hooks;

	const router = new OpenAPIHono({
		defaultHook: validationHook
	});

	const githubFetchClient = createOpenApiFetchClient<githubApiV1.paths>({
		prefixUrl: 'https://api.github.com'
	});

	router.openapi(GetGithubOAuthLoginRoute, async (c) => {
		const { callbackUrl } = c.req.valid('query');

		try {
			await onLoginStart?.(c, { callbackUrl });

			// Prepare state with CSRF protection
			const state: TGithubOAuthState = {
				csrf: generateState(),
				callbackUrl
			};
			const encodedState = encodeURIComponent(JSON.stringify(state));

			let url: URL;
			try {
				url = client.createAuthorizationURL(encodedState, scope);
			} catch (err) {
				const { error, message } = extractErrorData(err);
				throw new AppError('#ERR_GITHUB_LOGIN_FAILED', 500, {
					title: 'GitHub login failed',
					detail: message,
					throwable: error ?? undefined
				});
			}

			setCookie(c, 'github_oauth_state', encodedState, {
				path: '/',
				secure: true,
				httpOnly: true,
				maxAge: 60 * 10, // 10 minutes
				sameSite: 'lax'
			});

			return c.json({ url: url.toString() }, 200);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	router.openapi(GetGithubOAuthCallbackRoute, async (c) => {
		const { code, state } = c.req.valid('query');

		let githubUser: TGithubUserWithPrimaryEmail | undefined;
		let stateData: TGithubOAuthState | null = null;

		try {
			// Get & validate state
			const cookieState = getCookie(c, 'github_oauth_state');
			if (cookieState !== state) {
				throw new AppError('#ERR_GITHUB_INVALID_STATE', 400, {
					title: 'CSRF token mismatch'
				});
			}

			// Parse state data
			try {
				stateData = JSON.parse(decodeURIComponent(state)) as TGithubOAuthState;
			} catch (err) {
				const { error } = extractErrorData(err);
				throw new AppError('#ERR_GITHUB_INVALID_STATE', 400, {
					title: 'Failed to parse state data',
					throwable: error ?? undefined
				});
			}

			// Validate callback URL
			if (getRootHostname(apiUrl) !== getRootHostname(stateData.callbackUrl)) {
				throw new AppError('#ERR_GITHUB_INVALID_CALLBACK', 400, {
					title: 'Invalid callback domain',
					detail: 'Callback URL must share the same top-level domain as the API'
				});
			}

			// Validate authorization code
			let tokens: OAuth2Tokens;
			try {
				tokens = await client.validateAuthorizationCode(code);
			} catch (err) {
				const { error, message } = extractErrorData(err);
				throw new AppError('#ERR_GITHUB_INVALID_CODE', 401, {
					title: 'GitHub authorization code invalid',
					detail: message,
					throwable: error ?? undefined
				});
			}

			// Fetch user profile from GitHub
			const githubUserResult = await githubFetchClient.get('/user', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			});
			if (githubUserResult.isErr()) {
				throw new AppError('#ERR_GITHUB_PROFILE_FETCH_FAILED', 500, {
					title: 'GitHub profile fetch failed',
					detail: githubUserResult.error.message,
					throwable: githubUserResult.error ?? undefined
				});
			}
			const githubUserData = githubUserResult.value.data;

			// The /user endpoint only returns the public email address.
			// If the user has set their profile to "Don't show my email address",
			// it will be null. To get the primary email address regardless of privacy settings,
			// we need to use the /user/emails endpoint.
			// https://stackoverflow.com/questions/35373995/github-user-email-is-null-despite-useremail-scope
			let githubUserPrimaryEmail: {
				email: string;
				verified: boolean;
			} | null = null;
			const githubEmailResult = await githubFetchClient.get('/user/emails', {
				queryParams: {},
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			});
			if (githubEmailResult.isOk()) {
				const primaryEmail = githubEmailResult.value.data.find((email) => email.primary);
				if (primaryEmail != null) {
					githubUserPrimaryEmail = {
						email: primaryEmail.email,
						verified: primaryEmail.verified
					};
				}
			}
			if (githubUserPrimaryEmail == null) {
				throw new AppError('#ERR_GITHUB_PROFILE_FETCH_FAILED', 500, {
					title: 'Failed to fetch primary email address'
				});
			}

			githubUser = {
				...githubUserData,
				primary_email: githubUserPrimaryEmail
			};

			const updateUserResult = await updateUser(c, {
				githubUser,
				tokens
			});

			await createSession(c, { githubUser, updateUserResult });

			await onLoginSuccess?.(c, { githubUser, updateUserResult });
			return c.redirect(stateData.callbackUrl, 302);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error, githubUser });

			// Redirect to callback URL with error if configured
			if (redirectCallbackErrors && stateData != null) {
				const error = err as Error;
				const searchParams = new URLSearchParams({
					errorCode: error instanceof AppError ? error.code : '#ERR_UNKNOWN'
				});
				return c.redirect(`${stateData.callbackUrl}?${searchParams.toString()}`, 302);
			}

			throw err;
		}
	});

	router.openapi(PostGithubOAuthLogoutRoute, async (c) => {
		try {
			await onLogoutStart?.(c);

			const destorySessionResult = await destroySession(c);

			await onLogoutSuccess?.(c, { destorySessionResult });
			return c.json({ success: true }, 200);
		} catch (err) {
			await onLogoutFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	return router;
}
