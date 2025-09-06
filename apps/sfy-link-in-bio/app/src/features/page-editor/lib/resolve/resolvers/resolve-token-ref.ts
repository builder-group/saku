import { isTokenRef, TMixinTokenSet, TRef, TVariableToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveTokenRef<GValue, GMixinTokenSet extends TMixinTokenSet>(
	sourceValue: TRef<GValue>,
	options: TResolveTokenRefOptions<GValue, GMixinTokenSet>
): TResult<GValue, AppError> {
	if (!isTokenRef(sourceValue)) {
		return Ok(sourceValue);
	}

	// Resolve mixin token
	if (sourceValue.tokenType === 'mixin' && options.mixin != null) {
		const { tokenSet, mapToTokenValue } = options.mixin;
		if (tokenSet == null) {
			return Err(new AppError('#ERR_TOKEN_SET_NOT_FOUND'));
		}

		const tokenValue = mapToTokenValue(sourceValue.key, tokenSet);
		if (tokenValue === undefined) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Mixin token value not found: ${sourceValue.key}`
				})
			);
		}

		return Ok(tokenValue);
	}

	// Resolve variable token
	if (sourceValue.tokenType === 'variable' && options.variable != null) {
		const { tokenMap, expectedType } = options.variable;
		if (tokenMap == null) {
			return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
		}

		const token = tokenMap[sourceValue.key];
		if (token == null) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Variable token not found: ${sourceValue.key}`
				})
			);
		}

		if (expectedType != null && typeof token.value !== expectedType) {
			return Err(
				new AppError('#ERR_TOKEN_TYPE_MISMATCH', {
					detail: `Source token type mismatch: ${token.type} !== ${expectedType}`
				})
			);
		}

		return Ok(token.value as GValue);
	}

	return Err(new AppError('#ERR_TOKEN_REF_NOT_FOUND'));
}

export interface TResolveTokenRefOptions<GValue, GMixinTokenSet extends TMixinTokenSet> {
	mixin?: {
		tokenSet: GMixinTokenSet | undefined | null;
		mapToTokenValue: (key: string, tokenSet?: GMixinTokenSet) => GValue | undefined;
	};
	variable?: {
		tokenMap: Record<string, TVariableToken> | undefined | null;
		expectedType?: 'string' | 'number' | 'boolean';
	};
}
