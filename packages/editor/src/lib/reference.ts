import { TReference } from '../types';

/**
 * Creates an inherited style reference
 */
export function inherit<T>(): TReference<T> {
	return { type: 'inherit' };
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
	return value === 'inherit' ? inherit() : value;
}
