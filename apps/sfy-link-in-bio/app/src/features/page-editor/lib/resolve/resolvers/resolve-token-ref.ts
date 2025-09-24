import { isTokenRef, TRef, TToken } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { safeParse, type BaseIssue, type BaseSchema } from 'valibot';
import { AppError } from '@/lib';

export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue>,
	options?: TResolveTokenRefOptions<GTokenValue>
): TResult<GTokenValue, AppError>;
export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue> | undefined,
	options?: TResolveTokenRefOptions<GTokenValue>
): TResult<GTokenValue | undefined, AppError>;
export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue> | undefined,
	options: TResolveTokenRefOptions<GTokenValue> = {}
): TResult<GTokenValue | undefined, AppError> {
	if (!isTokenRef(sourceValue)) {
		return Ok(sourceValue);
	}

	const { tokenMap, schema } = options;
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

	// Handle path-based token reference or direct value
	let resolvedValue: unknown;
	if (sourceValue.path != null) {
		const pathResult = getNestedProperty(token.value, sourceValue.path, tokenMap);
		if (pathResult.isErr()) {
			return Err(
				new AppError('#ERR_PATH_NOT_FOUND', {
					detail: `Path '${sourceValue.path}' not found in token: ${sourceValue.key}`
				})
			);
		}
		resolvedValue = pathResult.value;
	} else {
		resolvedValue = token.value;
	}

	// Validate the resolved value if schema is provided
	if (schema != null) {
		const result = safeParse(schema, resolvedValue);
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join(', ');
			return Err(
				new AppError('#ERR_INVALID_TOKEN_VALUE', {
					detail: `Token value validation failed for: ${sourceValue.key}${sourceValue.path != null ? `.${sourceValue.path}` : ''} - ${issues}`
				})
			);
		}
		resolvedValue = result.output;
	}

	return Ok(resolvedValue as GTokenValue);
}

export interface TResolveTokenRefOptions<GTokenValue> {
	tokenMap?: Record<TToken['key'], TToken>;
	schema?: BaseSchema<GTokenValue, unknown, BaseIssue<unknown>>;
}

function getNestedProperty(
	obj: unknown,
	path: string,
	tokenMap?: Record<TToken['key'], TToken>
): TResult<unknown, AppError> {
	const pathParts = path.split('.');
	let current: unknown = obj;

	for (const key of pathParts) {
		// Check if current value is a token reference and resolve it
		if (isTokenRef(current)) {
			const [isResolvedOk, resolvedErr, resolved] = resolveTokenRef(current, { tokenMap });
			if (!isResolvedOk) {
				return Err(
					resolvedErr.wrapWith('#ERR_PATH_NOT_FOUND', {
						detail: `Path '${path}' not found - failed at key: ${key}`
					})
				);
			}
			current = resolved;
		}

		// Navigate to the next property
		if (current != null && typeof current === 'object' && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return Err(
				new AppError('#ERR_PATH_NOT_FOUND', {
					detail: `Path '${path}' not found - failed at key: ${key}`
				})
			);
		}
	}

	return Ok(current);
}
