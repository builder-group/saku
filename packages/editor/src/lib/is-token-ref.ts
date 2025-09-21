import { TRef, TTokenRef } from '../types';

export function isTokenRef<GValue = any>(
	value: TRef<GValue> | null | undefined
): value is TTokenRef<GValue> {
	return (
		value != null &&
		typeof value === 'object' &&
		'type' in value &&
		value.type === 'token' &&
		'key' in value
	);
}
