import { isTokenRef, uninherit } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';

export function resolveNestedTokenRef<
	GSourceValue extends Record<string, any>,
	GTokenValue extends Record<string, any>,
	GPropertyKey extends keyof GSourceValue & keyof GTokenValue
>(
	propertyKey: GPropertyKey,
	sourceValue: GSourceValue,
	tokenSet: Record<string, GTokenValue> | undefined | null
): TResult<GTokenValue[GPropertyKey], AppError> {
	const propertyValue = sourceValue[propertyKey];
	if (!isTokenRef(propertyValue)) {
		return Ok(uninherit(propertyValue));
	}

	if (tokenSet == null) {
		return Err(new AppError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	const token = tokenSet[propertyValue.ref];
	if (token == null) {
		return Err(
			new AppError('#ERR_TOKEN_NOT_FOUND', { detail: `Token not found: ${propertyValue.ref}` })
		);
	}

	if (!(propertyKey in token)) {
		return Err(
			new AppError('#ERR_PROPERTY_NOT_FOUND', {
				detail: `Property not found: ${String(propertyKey)}`
			})
		);
	}

	return Ok(token[propertyKey]);
}
