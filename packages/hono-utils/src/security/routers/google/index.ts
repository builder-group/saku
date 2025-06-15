import { extractErrorData, getRootHostname } from '@blgc/utils';
import { OpenAPIHono } from '@hono/zod-openapi';
import { decodeIdToken, generateCodeVerifier, generateState, OAuth2Tokens } from 'arctic';
import { getCookie, setCookie } from 'hono/cookie';
import { AppError } from '@/error';
import { validationHook } from '@/openapi';
import {
	GetGoogleOAuthCallbackRoute,
	GetGoogleOAuthLoginRoute,
	PostGoogleOAuthLogoutRoute
} from './schema';
import type { TGoogleClaims, TGoogleOAuthConfig, TGoogleOAuthState } from './types';

export const createGoogleOAuthRouter = <GUpdateUserResult = void, GDestorySessionResult = void>(
	config: TGoogleOAuthConfig<GUpdateUserResult, GDestorySessionResult>
) => {
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

	router.openapi(GetGoogleOAuthLoginRoute, async (c) => {
		const { callbackUrl } = c.req.valid('query');

		try {
			await onLoginStart?.(c, { callbackUrl });

			// Prepare state with CSRF protection
			const state: TGoogleOAuthState = {
				csrf: generateState(),
				callbackUrl
			};
			const encodedState = encodeURIComponent(JSON.stringify(state));

			// Generate code verifier for PKCE
			const codeVerifier = generateCodeVerifier();

			let url: URL;
			try {
				url = client.createAuthorizationURL(encodedState, codeVerifier, scope);
			} catch (err) {
				const { error, message } = extractErrorData(err);
				throw new AppError('#ERR_GOOGLE_LOGIN_FAILED', 500, {
					title: 'Google login failed',
					detail: message,
					throwable: error ?? undefined
				});
			}

			setCookie(c, 'google_oauth_state', encodedState, {
				httpOnly: true,
				secure: true,
				path: '/',
				maxAge: 60 * 10, // 10 minutes
				sameSite: 'lax'
			});
			setCookie(c, 'google_oauth_code_verifier', codeVerifier, {
				httpOnly: true,
				secure: true,
				path: '/',
				maxAge: 60 * 10, // 10 minutes
				sameSite: 'lax'
			});

			return c.json({ url: url.toString() }, 200);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	router.openapi(GetGoogleOAuthCallbackRoute, async (c) => {
		const { code, state } = c.req.valid('query');

		let googleClaims: TGoogleClaims | undefined;
		let stateData: TGoogleOAuthState | null = null;

		try {
			// Get & validate state
			const cookieState = getCookie(c, 'google_oauth_state');
			if (cookieState !== state) {
				throw new AppError('#ERR_GOOGLE_INVALID_STATE', 400, {
					title: 'CSRF token mismatch'
				});
			}

			// Get code verifier
			const codeVerifier = getCookie(c, 'google_oauth_code_verifier');
			if (codeVerifier == null) {
				throw new AppError('#ERR_GOOGLE_INVALID_CODE_VERIFIER', 400, {
					title: 'Code verifier not found'
				});
			}

			// Parse state data
			try {
				stateData = JSON.parse(decodeURIComponent(state)) as TGoogleOAuthState;
			} catch (err) {
				const { error } = extractErrorData(err);
				throw new AppError('#ERR_GOOGLE_INVALID_STATE', 400, {
					title: 'Failed to parse state data',
					throwable: error ?? undefined
				});
			}

			// Validate callback URL
			if (getRootHostname(apiUrl) !== getRootHostname(stateData.callbackUrl)) {
				throw new AppError('#ERR_GOOGLE_INVALID_CALLBACK', 400, {
					title: 'Invalid callback domain',
					detail: 'Callback URL must share the same top-level domain as the API'
				});
			}

			// Validate authorization code
			let tokens: OAuth2Tokens;
			try {
				tokens = await client.validateAuthorizationCode(code, codeVerifier);
			} catch (err) {
				const { error, message } = extractErrorData(err);
				throw new AppError('#ERR_GOOGLE_INVALID_CODE', 401, {
					title: 'Google authorization code invalid',
					detail: message,
					throwable: error ?? undefined
				});
			}

			// Decode ID token to get Google claims
			googleClaims = decodeIdToken(tokens.idToken()) as TGoogleClaims;

			const updateUserResult = await updateUser(c, { googleClaims, tokens });

			await createSession(c, { googleClaims, updateUserResult });

			await onLoginSuccess?.(c, { googleClaims, updateUserResult });
			return c.redirect(stateData.callbackUrl, 302);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error, googleClaims });

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

	router.openapi(PostGoogleOAuthLogoutRoute, async (c) => {
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
};
