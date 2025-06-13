import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

export function generateToken(byteCount = 20): string {
	const bytes = new Uint8Array(byteCount);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}
