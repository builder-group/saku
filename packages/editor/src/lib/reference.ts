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
 * @returns The resolved value
 */
export function resolveReference<T>(value: TReference<T>, inheritedValue: T): T;
export function resolveReference<T>(value?: TReference<T>): T | undefined;
export function resolveReference<T>(value?: TReference<T>, inheritedValue?: T): T | undefined {
	if (value == null) {
		return inheritedValue;
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
 */
export type TReference<T> = { type: 'inherit' } | T;

/**
 * Recursively resolves all TReference types in an object, removing inheritance markers.
 */
export type TUnreference<T> = T extends { type: 'inherit' }
	? never // Remove inherit completely
	: T extends object
		? { [K in keyof T]: TUnreference<T[K]> }
		: T;
