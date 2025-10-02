import { Err, Ok, TResult } from 'tuple-result';
import { safeParse, type BaseIssue, type BaseSchema } from 'valibot';
import { TRef, TToken } from '../types';
import { EditorError } from './EditorError';
import { isTokenRef } from './is-token-ref';

export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue>,
	options?: TResolveTokenRefOptions<GTokenValue>
): TResult<GTokenValue, EditorError>;
export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue> | undefined,
	options?: TResolveTokenRefOptions<GTokenValue>
): TResult<GTokenValue | undefined, EditorError>;
export function resolveTokenRef<GTokenValue>(
	sourceValue: TRef<GTokenValue> | undefined,
	options: TResolveTokenRefOptions<GTokenValue> = {}
): TResult<GTokenValue | undefined, EditorError> {
	if (!isTokenRef(sourceValue)) {
		return Ok(sourceValue);
	}

	const { tokenMap, expectedSchema } = options;
	if (tokenMap == null) {
		return Err(new EditorError('#ERR_TOKEN_MAP_NOT_FOUND'));
	}

	const token = tokenMap[sourceValue.key];
	if (token === undefined) {
		return Err(
			new EditorError('#ERR_TOKEN_NOT_FOUND', {
				detail: `Token not found: ${sourceValue.key}`
			})
		);
	}

	// Check if the token type matches or is a subset of the source value's token type
	// e.g. 'paint.solid' is valid for expected type 'paint' since its a subset
	if (
		sourceValue.tokenType != null &&
		token.type !== sourceValue.tokenType &&
		!token.type.startsWith(`${sourceValue.tokenType}.`)
	) {
		return Err(
			new EditorError('#ERR_TOKEN_TYPE_MISMATCH', {
				detail: `Token ${sourceValue.key} has type '${token.type}' but expected '${sourceValue.tokenType}'`
			})
		);
	}

	let resolvedValue: unknown;

	// Handle path-based token reference or direct value
	if (sourceValue.path != null) {
		const pathResult = getNestedProperty(token.value, sourceValue.path, tokenMap);
		if (pathResult.isErr()) {
			return Err(
				new EditorError('#ERR_PATH_NOT_FOUND', {
					detail: `Path '${sourceValue.path}' not found in token: ${sourceValue.key}`
				})
			);
		}
		resolvedValue = pathResult.value;
	} else {
		resolvedValue = token.value;
	}

	// If the resolved value is still a token reference, resolve it
	if (isTokenRef(resolvedValue)) {
		const [isNestedResolvedValueOk, nestedResolvedValueErr, nestedResolvedValue] = resolveTokenRef(
			resolvedValue,
			{
				tokenMap
			}
		);
		if (!isNestedResolvedValueOk) {
			return Err(nestedResolvedValueErr.wrapWith('#ERR_RESOLVE_NESTED_TOKEN_REF'));
		}
		resolvedValue = nestedResolvedValue;
	}

	// Validate the resolved value if expected schema is provided
	if (expectedSchema != null) {
		const result = safeParse(expectedSchema, resolvedValue);
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join(', ');
			return Err(
				new EditorError('#ERR_INVALID_TOKEN_VALUE', {
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
	expectedSchema?: BaseSchema<GTokenValue, unknown, BaseIssue<unknown>>;
}

function getNestedProperty(
	obj: unknown,
	path: string,
	tokenMap?: Record<TToken['key'], TToken>
): TResult<unknown, EditorError> {
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
				new EditorError('#ERR_PATH_NOT_FOUND', {
					detail: `Path '${path}' not found - failed at key: ${key}`
				})
			);
		}
	}

	return Ok(current);
}
