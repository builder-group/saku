import { TRef, TTokens } from '../types';
import { isTokenRef } from './is-token-ref';

export function resolveRef<T>(
	key: keyof TTokens,
	value?: TRef<T>,
	tokens?: TTokens
): T | undefined {
	if (isTokenRef(value)) {
		return tokens?.[key as keyof TTokens]?.[value.ref] as T;
	}
	return value;
}
