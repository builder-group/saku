import { isTokenRef, TRef, TTokenSet, TUnreference } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveTokenRef<GValue, GTokenSet extends TTokenSet>(
	sourceValue: TRef<GValue>,
	tokenSet: GTokenSet | undefined | null,
	mapToToken: (ref: string, tokenSet?: GTokenSet) => GValue | undefined
): TResult<GValue, AppError> {
	if (tokenSet == null) {
		return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	// Resolve sourceValue if it's a token ref
	if (isTokenRef(sourceValue)) {
		const sourceToken = mapToToken(sourceValue.ref, tokenSet);
		if (sourceToken === undefined) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Source token not found: ${sourceValue.ref}`
				})
			);
		}
		return Ok(sourceToken);
	}

	return Ok(sourceValue);
}

export function resolveNestedTokenRef<
	GValue extends Record<string, TRef<any>>,
	GPropertyKey extends keyof GValue,
	GTokenSet extends TTokenSet
>(
	sourceValue: TRef<GValue>,
	tokenSet: GTokenSet | undefined | null,
	mapToToken: (ref: string, tokenSet?: GTokenSet) => GValue | undefined,
	propertyKey: GPropertyKey
): TResult<TUnreference<GValue[GPropertyKey]>, AppError> {
	if (tokenSet == null) {
		return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	// Resolve sourceValue if it's a token ref
	const [isResolvedOk, resolvedErr, resolvedValue] = resolveTokenRef(
		sourceValue,
		tokenSet,
		mapToToken
	);
	if (!isResolvedOk) {
		return Err(resolvedErr);
	}

	// Resolve propertyValue if it's a token ref
	const propertyValue: TRef<GValue[GPropertyKey]> = resolvedValue[propertyKey];
	if (isTokenRef(propertyValue)) {
		const propertyToken = mapToToken(propertyValue.ref, tokenSet);
		if (propertyToken === undefined) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Property token not found: ${propertyValue.ref}`
				})
			);
		}

		return Ok(propertyToken[propertyKey]);
	}

	return Ok(propertyValue);
}
