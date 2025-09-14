import { isTokenRef, TRef, TUnreferenceTop } from '@repo/editor';

/**
 * Unpacks a top-level token reference by spreading it to all properties of the mixin value.
 * If the value is not a token reference, returns it as-is.
 *
 * @param value - The mixin value that may be a token reference
 * @param properties - Array of property names to unpack the token reference to
 */
export function unpackTokenRef<T extends Record<string, unknown>>(
	value: TRef<T>,
	properties: readonly (keyof T)[]
): TUnreferenceTop<TRef<T>> {
	if (!isTokenRef(value)) {
		return value as TUnreferenceTop<TRef<T>>;
	}

	// Create an object with all specified properties set to the token reference
	const unpacked = {} as Record<string, unknown>;
	for (const key of properties) {
		unpacked[key as string] = value;
	}
	return unpacked as TUnreferenceTop<TRef<T>>;
}
