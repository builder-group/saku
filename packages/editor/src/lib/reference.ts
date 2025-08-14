/**
 * Creates an inherited style reference
 */
export function inherit<T>(): TReference<T> {
	return { type: 'inherit' } as TReference<T>;
}

/**
 * Checks if a style reference is inherited
 */
export function isInherited<T>(
	value: TReference<T> | undefined
): value is TReference<T> & { type: 'inherit' } {
	return value != null && typeof value === 'object' && 'type' in value && value.type === 'inherit';
}

/**
 * Gets the actual value from a style reference, considering inheritance
 * @param value The style reference to resolve
 * @param inheritedValue The value to use if the reference is inherited
 * @returns The resolved value, or undefined if no value is available
 */
export function resolveReference<T>(
	value: TReference<T> | undefined,
	inheritedValue?: T
): T | undefined {
	if (value == null) {
		return undefined;
	}

	if (isInherited(value)) {
		return inheritedValue;
	}

	return value;
}

/**
 * Creates a style reference from a value
 * @param value The value to reference, or 'inherit' to create an inherited reference
 */
export function createReference<T>(value: T | 'inherit'): TReference<T> {
	return value === 'inherit' ? inherit() : (value as TReference<T>);
}

/**
 * Creates a TReference wrapper around a value
 * @param value The value to wrap in a TReference
 * @returns A TReference<T> containing the value
 */
export function ref<T>(value: T): TReference<T> {
	return value as TReference<T>;
}

/**
 * A reference that can either inherit from parent or hold an actual value.
 * Uses { type: 'inherit' } for type-safe inheritance without ambiguity.
 *
 * The brand makes TReference<T> completely unique and distinct from T,
 * preventing type confusion.
 */
export type TReference<T> = ({ type: 'inherit' } | T) & { readonly __brand: 'Reference' };

/**
 * Recursively resolves all TReference types in an object, removing inheritance markers.
 * Note: Only null is supported (not undefined) due to TypeScript union type limitations.
 */
export type TUnreference<T> =
	// Note: We explicitly handle null first because TypeScript loses it during 'infer U' extraction
	T extends TReference<null>
		? null
		: T extends TReference<infer U>
			? U extends { type: 'inherit' }
				? never
				: U
			: T extends object
				? { [K in keyof T]: TUnreference<T[K]> }
				: T;
