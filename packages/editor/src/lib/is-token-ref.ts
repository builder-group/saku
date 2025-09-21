import { TRef, TTokenRef } from '../types';

export function isTokenRef(value: TRef<any> | null | undefined): value is TTokenRef {
	return (
		value != null &&
		typeof value === 'object' &&
		'type' in value &&
		value.type === 'token' &&
		'key' in value
	);
}
