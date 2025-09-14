import { isTokenRef, TRef, TTokenRef, TUnreferenceTop } from '@repo/editor';

/**
 * Packs a mixin value back to a token reference if all properties reference the same token.
 * If not all properties reference the same token, returns the original value.
 *
 * @param value - The mixin value to pack
 * @param properties - Array of property names to check for token references
 */
export function packTokenRef<T extends Record<string, unknown>>(
	value: TUnreferenceTop<TRef<T>>,
	properties: readonly (keyof T)[]
): TRef<T> {
	// Find the first token reference to use as the base
	let baseTokenRef: TTokenRef | null = null;

	for (const key of properties) {
		const propValue = value[key];
		if (isTokenRef(propValue)) {
			if (baseTokenRef == null) {
				baseTokenRef = propValue;
			}
			// Different token keys found, can't pack
			else if (propValue.key !== baseTokenRef.key) {
				return value as TRef<T>;
			}
		}
		// Non-token reference found, can't pack
		else {
			return value as TRef<T>;
		}
	}

	return baseTokenRef as TRef<T>;
}
