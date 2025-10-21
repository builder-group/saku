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

	// Validate token type compatibility
	// e.g. 'paint.solid' token is valid for expected type 'paint' (subtype matching)
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

	let resolvedValue: unknown = token.value;

	// Navigate to nested property if path specified
	if (sourceValue.path != null) {
		resolvedValue = getNestedProperty(resolvedValue, sourceValue.path, tokenMap);
	}

	// Recursively resolve nested token references
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

	// Validate final value against expected schema
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
): unknown {
	const pathParts = path.split('.');
	let current: unknown = obj;

	for (const key of pathParts) {
		// Resolve any token references encountered during path traversal
		if (isTokenRef(current)) {
			const [isResolvedOk, , resolved] = resolveTokenRef(current, { tokenMap });
			if (!isResolvedOk) {
				return undefined;
			}
			current = resolved;
		}

		// Access next property in path
		if (current != null && typeof current === 'object' && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return undefined; // Dead end
		}
	}

	return current;
}
