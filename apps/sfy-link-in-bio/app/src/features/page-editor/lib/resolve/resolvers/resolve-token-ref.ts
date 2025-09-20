import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveTokenRef<
	GTokenValue extends TToken['value'],
	GBaseValue extends TToken['value'] = TToken['value']
>(
	sourceValue: TRef<GTokenValue>,
	options: TResolveTokenRefOptions<GTokenValue, GBaseValue>
): TResult<GTokenValue, AppError> {
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

	// Use mapping function to extract specific property from token value, or return token value directly
	const mappedValue =
		mapToTokenValue != null
			? mapToTokenValue(token.value as GBaseValue)
			: (token.value as GTokenValue);
	if (mappedValue === undefined) {
		return Err(
			new AppError('#ERR_TOKEN_VALUE_MAPPING', {
				detail: `Failed to map token value for: ${sourceValue.key}`
			})
		);
	}

	// Verify token type if expected type is specified
	if (expectedType != null && token.type !== expectedType) {
		return Err(
			new AppError('#ERR_TOKEN_TYPE_MISMATCH', {
				detail: `Expected token type '${expectedType}' but got '${token.type}' for key: ${sourceValue.key}`
			})
		);
	}

	return Ok(mappedValue);
}

export interface TResolveTokenRefOptions<
	GTokenValue extends TToken['value'],
	GBaseValue extends TToken['value'] = TToken['value']
> {
	tokenMap: Record<TToken['key'], TToken> | undefined | null;
	expectedType?: TToken['type'];
	mapToTokenValue?: (tokenValue: GBaseValue) => GTokenValue | undefined;
}
