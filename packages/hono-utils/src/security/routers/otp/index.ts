import { getRootHostname } from '@blgc/utils';
import { OpenAPIHono } from '@hono/zod-openapi';
import { AppError } from '@/error';
import { validationHook } from '@/openapi';
import { hashToken } from '../../lib';
import { generateOtp } from './otp';
import {
	GetOtpCallbackRoute,
	GetOtpVerifyRoute,
	PostOtpLoginRoute,
	PostOtpLogoutRoute
} from './schema';
import type { TOtpConfig } from './types';
import { verifyOtp } from './verify-otp';

export function createOtpRouter<GUpdateUserResult = void, GDestroySessionResult = void>(
	config: TOtpConfig<GUpdateUserResult, GDestroySessionResult>
): OpenAPIHono {
	const {
		apiUrl,
		updateUser,
		createSession,
		destroySession,
		deliverOtp,
		storeOtp,
		getOtp,
		deleteOtp,
		updateOtpAttempts,
		hooks = {},
		redirectCallbackErrors = true,
		otpExpiresIn = 300,
		otpFormat = 'base36',
		maxAttempts = 3
	} = config;

	const {
		onLoginStart,
		onLoginSuccess,
		onLoginFailed,
		onLogoutStart,
		onLogoutSuccess,
		onLogoutFailed
	} = hooks;

	const router = new OpenAPIHono({
		defaultHook: validationHook
	});

	router.openapi(PostOtpLoginRoute, async (c) => {
		const { identifier, callbackUrl } = c.req.valid('json');

		try {
			await onLoginStart?.(c, { identifier, callbackUrl });

			// Generate OTP and hash for storage
			const otp = generateOtp(6, otpFormat);
			const otpHash = hashToken(otp);

			// Store OTP data
			await storeOtp(c, {
				identifier,
				otpHash,
				timestamp: Date.now(),
				attempts: 0
			});

			// Send OTP to user
			await deliverOtp(c, {
				identifier,
				otp,
				callbackUrl
			});

			return c.json({ success: true }, 200);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	router.openapi(GetOtpCallbackRoute, async (c) => {
		const { identifier, otp, callbackUrl } = c.req.valid('query');

		try {
			// Validate callback URL
			if (getRootHostname(apiUrl) !== getRootHostname(callbackUrl)) {
				throw new AppError('#ERR_OTP_INVALID_CALLBACK', 400, {
					title: 'Invalid callback domain',
					detail: 'Callback URL must share the same top-level domain as the API'
				});
			}

			const { updateUserResult } = await verifyOtp(c, {
				identifier,
				otp,
				maxAttempts,
				otpExpiresIn,
				getOtp,
				updateUser,
				createSession,
				deleteOtp,
				updateOtpAttempts
			});
			await onLoginSuccess?.(c, { identifier, updateUserResult });

			return c.redirect(callbackUrl, 302);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error });

			// Redirect to callback URL with error if configured
			if (redirectCallbackErrors && callbackUrl) {
				const error = err as Error;
				const searchParams = new URLSearchParams({
					errorCode: error instanceof AppError ? error.code : '#ERR_UNKNOWN'
				});
				return c.redirect(`${callbackUrl}?${searchParams.toString()}`, 302);
			}

			throw err;
		}
	});

	router.openapi(GetOtpVerifyRoute, async (c) => {
		const { identifier, otp } = c.req.valid('query');

		try {
			const { updateUserResult } = await verifyOtp(c, {
				identifier,
				otp,
				maxAttempts,
				otpExpiresIn,
				getOtp,
				updateUser,
				createSession,
				deleteOtp,
				updateOtpAttempts
			});
			await onLoginSuccess?.(c, { identifier, updateUserResult });

			return c.json({ success: true }, 200);
		} catch (err) {
			await onLoginFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	router.openapi(PostOtpLogoutRoute, async (c) => {
		try {
			await onLogoutStart?.(c);

			const destroySessionResult = await destroySession(c);

			await onLogoutSuccess?.(c, { destroySessionResult });
			return c.json({ success: true }, 200);
		} catch (err) {
			await onLogoutFailed?.(c, { error: err as Error });
			throw err;
		}
	});

	return router;
}
