import { Context } from 'hono';
import { AppError } from '@/error';
import { hashToken, safeCompare } from '../../lib';
import type { TOtpConfig } from './types';

export async function verifyOtp<GUpdateUserResult = void, GDestroySessionResult = void>(
	c: Context,
	config: TVerifyOtpConfig<GUpdateUserResult, GDestroySessionResult>
): Promise<{
	updateUserResult: GUpdateUserResult;
}> {
	const {
		identifier,
		otp,
		maxAttempts = 3,
		otpExpiresIn = 300,
		getOtp,
		updateUser,
		createSession,
		deleteOtp,
		updateOtpAttempts
	} = config;

	const otpData = await getOtp(c, { identifier });
	if (otpData == null) {
		throw new AppError('#ERR_OTP_NO_ACTIVE_REQUEST', 400, {
			title: 'No active OTP request found'
		});
	}

	// Check if OTP has expired
	if (Date.now() - otpData.timestamp > otpExpiresIn * 1000) {
		await deleteOtp(c, { identifier });
		throw new AppError('#ERR_OTP_EXPIRED', 400, {
			title: 'OTP expired',
			detail: 'The OTP has expired. Please request a new one.'
		});
	}

	// Verify OTP
	if (!safeCompare(hashToken(otp), otpData.otpHash)) {
		const nextAttemptCount = otpData.attempts + 1;
		if (nextAttemptCount >= maxAttempts) {
			await deleteOtp(c, { identifier });
			throw new AppError('#ERR_OTP_MAX_ATTEMPTS', 400, {
				title: 'Maximum verification attempts exceeded',
				detail: `Maximum verification attempts (${maxAttempts}) exceeded. Please request a new OTP.`,
				errors: [
					{
						maxAttempts,
						attempts: nextAttemptCount
					}
				]
			});
		}

		await updateOtpAttempts(c, { identifier, attempts: nextAttemptCount });
		throw new AppError('#ERR_OTP_INVALID_OTP', 400, {
			title: 'Invalid OTP provided',
			detail: `Invalid OTP provided. ${maxAttempts - nextAttemptCount} attempts remaining.`,
			errors: [
				{
					maxAttempts,
					attempts: nextAttemptCount
				}
			]
		});
	}

	// Delete OTP data to be one-time use
	await deleteOtp(c, { identifier });

	const updateUserResult = await updateUser(c, {
		identifier,
		verified: true
	});

	await createSession(c, { identifier, updateUserResult });

	return {
		updateUserResult
	};
}

interface TVerifyOtpConfig<GUpdateUserResult = void, GDestroySessionResult = void> {
	identifier: string;
	otp: string;
	maxAttempts: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['maxAttempts'];
	otpExpiresIn: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['otpExpiresIn'];
	getOtp: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['getOtp'];
	updateUser: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['updateUser'];
	createSession: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['createSession'];
	deleteOtp: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['deleteOtp'];
	updateOtpAttempts: TOtpConfig<GUpdateUserResult, GDestroySessionResult>['updateOtpAttempts'];
}
