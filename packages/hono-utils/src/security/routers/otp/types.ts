import type { Context } from 'hono';

export interface TOtpConfig<GUpdateUserResult = void, GDestroySessionResult = void> {
	/** Base URL of the API */
	apiUrl: string;
	/** Whether to redirect errors to callback URL (default: true) */
	redirectCallbackErrors?: boolean;
	/** OTP expiration time in seconds (default: 300) */
	otpExpiresIn?: number;
	/** OTP format (default: base36) */
	otpFormat?: 'base10' | 'base36';
	/** Maximum number of verification attempts before OTP is invalidated (default: 3) */
	maxAttempts?: number;
	/**
	 * Update or create user in your system
	 */
	updateUser: (
		c: Context,
		data: { identifier: string; verified: boolean }
	) => Promise<GUpdateUserResult>;
	/**
	 * Create a session for the authenticated user
	 */
	createSession: (
		c: Context,
		data: { identifier: string; updateUserResult: GUpdateUserResult }
	) => Promise<void>;
	/**
	 * Destroy the current session
	 */
	destroySession: (c: Context) => Promise<GDestroySessionResult>;
	/**
	 * Handle sending/delivering the OTP
	 */
	deliverOtp: (
		c: Context,
		data: { identifier: string; otp: string; callbackUrl: string }
	) => Promise<void>;
	/**
	 * Store OTP data in your preferred storage
	 */
	storeOtp: (c: Context, data: TOtpData) => Promise<void>;
	/**
	 * Get OTP data from your storage
	 */
	getOtp: (c: Context, data: { identifier: string }) => Promise<TOtpData | null>;
	/**
	 * Delete OTP data from your storage
	 */
	deleteOtp: (c: Context, data: { identifier: string }) => Promise<void>;
	/**
	 * Update OTP attempts counter in storage
	 */
	updateOtpAttempts: (c: Context, data: { identifier: string; attempts: number }) => Promise<void>;

	hooks?: {
		/** Called before sending OTP */
		onLoginStart?: (c: Context, data: { identifier: string; callbackUrl: string }) => Promise<void>;
		/** Called after successful verification */
		onLoginSuccess?: (
			c: Context,
			data: { identifier: string; updateUserResult: GUpdateUserResult }
		) => Promise<void>;
		/** Called when verification fails */
		onLoginFailed?: (c: Context, data: { identifier?: string; error: Error }) => Promise<void>;
		/** Called before starting logout */
		onLogoutStart?: (c: Context) => Promise<void>;
		/** Called after successful logout */
		onLogoutSuccess?: (
			c: Context,
			data: { destroySessionResult: GDestroySessionResult }
		) => Promise<void>;
		/** Called when logout fails */
		onLogoutFailed?: (c: Context, data: { error: Error }) => Promise<void>;
	};
}

/** OTP data stored during authentication */
export interface TOtpData {
	/** User identifier (email, phone, etc) */
	identifier: string;
	/** Hashed version of the OTP */
	otpHash: string;
	/** Timestamp when the OTP was created */
	timestamp: number;
	/** Number of failed verification attempts */
	attempts: number;
}
