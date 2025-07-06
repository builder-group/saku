import { createHash } from 'node:crypto';

export function createObjectHash(obj: Record<string, unknown>, sliceLength = 8): string {
	const str = JSON.stringify(obj);
	return createHash('sha256').update(str).digest('hex').slice(0, sliceLength);
}
