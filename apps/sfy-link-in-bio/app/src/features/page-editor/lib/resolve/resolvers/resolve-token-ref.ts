import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveTokenRef<GTokenValue extends TToken['value']>(
	sourceValue: TRef<GTokenValue>,
	options: TResolveTokenRefOptions
): TResult<GTokenValue, AppError> {
	if (!isTokenRef(sourceValue)) {
		return Ok(sourceValue);
	}

	const { tokenMap, expectedType } = options;
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
	if (
		expectedType != null &&
		sourceValue.tokenType != null &&
		sourceValue.tokenType !== expectedType
	) {
		return Err(
			new AppError('#ERR_TOKEN_TYPE_MISMATCH', {
				detail: `Expected token type '${expectedType}' but got '${sourceValue.tokenType}' for key: ${sourceValue.key}`
			})
		);
	}

	// Handle path-based token reference
	if (sourceValue.path != null) {
		const pathValue = getNestedProperty(token.value, sourceValue.path);
		if (pathValue === undefined) {
			return Err(
				new AppError('#ERR_PATH_NOT_FOUND', {
					detail: `Path '${sourceValue.path}' not found in token: ${sourceValue.key}`
				})
			);
		}

		return Ok(pathValue as GTokenValue);
	}

	return Ok(token.value as GTokenValue);
}

export interface TResolveTokenRefOptions {
	tokenMap: Record<TToken['key'], TToken>;
	expectedType?: TToken['type'];
}

function getNestedProperty(obj: unknown, path: string): unknown {
	return path.split('.').reduce((current: unknown, key: string) => {
		if (current != null && typeof current === 'object' && key in current) {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}
