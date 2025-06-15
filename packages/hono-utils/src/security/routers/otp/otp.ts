import { randomBytes } from 'crypto';

const DIGITS = '0123456789';
const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Generate a cryptographically secure OTP with uniform distribution (no modulo bias).
 */
export function generateOtp(length: 6 | 7 | 8 = 6, format: 'base10' | 'base36' = 'base10'): string {
	const charset = format === 'base36' ? BASE36 : DIGITS;

	// Reject bytes >= maxValidByte to avoid modulo bias when mapping to charset
	const maxValidByte = 256 - (256 % charset.length);

	let otp = '';
	while (otp.length < length) {
		const [byte] = randomBytes(1) as unknown as [number];
		if (byte < maxValidByte) {
			otp += charset[byte % charset.length];
		}
	}

	return otp;
}
