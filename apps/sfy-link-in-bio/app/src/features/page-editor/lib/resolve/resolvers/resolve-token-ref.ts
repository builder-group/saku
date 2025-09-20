import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveTokenRef<GValue, GBaseValue>(
	sourceValue: TRef<GValue>,
	options: TResolveTokenRefOptions<GValue, GBaseValue>
): TResult<GValue, AppError> {
	if (!isTokenRef(sourceValue)) {
		return Ok(sourceValue);
	}

	const { tokenMap, mapToTokenValue, expectedType } = options;
	if (tokenMap == null) {
		return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	const token = tokenMap[sourceValue.key];
	if (token == null) {
		return Err(
			new AppError('#ERR_TOKEN_NOT_FOUND', {
				detail: `Token not found: ${sourceValue.key}`
			})
		);
	}

	// Verify token type if expected type is specified
	if (expectedType != null && token.type !== expectedType) {
		return Err(
			new AppError('#ERR_TOKEN_TYPE_MISMATCH', {
				detail: `Expected token type '${options.expectedType}' but got '${token.type}' for key: ${sourceValue.key}`
			})
		);
	}

	// If no mapping function provided, return the token value directly
	if (mapToTokenValue == null) {
		return Ok(token.value as GValue);
	}

	// Use mapping function to extract specific property from token value
	const mappedValue = mapToTokenValue(token.value as GBaseValue);
	if (mappedValue === undefined) {
		return Err(
			new AppError('#ERR_TOKEN_VALUE_MAPPING', {
				detail: `Failed to map token value for: ${sourceValue.key}`
			})
		);
	}

	return Ok(mappedValue);
}

export interface TResolveTokenRefOptions<GValue, GBaseValue> {
	tokenMap: Record<TToken['key'], TToken> | undefined | null;
	expectedType?: TToken['type'];
	mapToTokenValue?: (tokenValue: GBaseValue) => GValue | undefined;
}
