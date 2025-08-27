import { isTokenRef, TRef, TUnreference, uninherit } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveNestedTokenRef<
	GValue extends Record<string, TRef<any>>,
	GPropertyKey extends keyof GValue
>(
	propertyKey: GPropertyKey,
	sourceValue: GValue | TRef<GValue>,
	tokenSet: Record<string, GValue> | undefined | null
): TResult<TUnreference<GValue[GPropertyKey]>, AppError> {
	if (tokenSet == null) {
		return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	// Resolve sourceValue if it's a token ref
	let resolvedValue: GValue;
	if (isTokenRef(sourceValue)) {
		const sourceToken = tokenSet[sourceValue.ref];
		if (sourceToken == null) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Source token not found: ${sourceValue.ref}`
				})
			);
		}
		resolvedValue = sourceToken;
	} else {
		resolvedValue = uninherit(sourceValue);
	}

	// Resolve propertyValue if it's a token ref
	const propertyValue: TRef<GValue[GPropertyKey]> = resolvedValue[propertyKey];
	if (isTokenRef(propertyValue)) {
		const propertyToken = tokenSet[propertyValue.ref];
		if (propertyToken == null) {
			return Err(
				new AppError('#ERR_TOKEN_NOT_FOUND', {
					detail: `Property token not found: ${propertyValue.ref}`
				})
			);
		}

		return Ok(propertyToken[propertyKey]);
	}

	return Ok(uninherit(propertyValue));
}
