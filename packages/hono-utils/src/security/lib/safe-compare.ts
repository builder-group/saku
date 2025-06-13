import { timingSafeEqual } from 'crypto';

/**
 * Safely compares two strings using constant-time algorithm to prevent timing attacks.
 * Returns false if lengths are different.
 *
 * @param a - First string
 * @param b - Second string
 * @returns boolean - Whether the strings are equal
 */
export function safeCompare(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);

	if (aBuf.length !== bBuf.length) {
		return false;
	}

	return timingSafeEqual(aBuf, bBuf);
}
