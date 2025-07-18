import { TStyleReference } from '../types';

/**
 * Creates an inherited style reference
 */
export function inheritStyle<T>(): TStyleReference<T> {
	return { type: 'inherit' };
}

/**
 * Checks if a style reference is inherited
 */
export function isInheritedStyle<T>(
	value: TStyleReference<T> | undefined
): value is TStyleReference<T> & { type: 'inherit' } {
	return value != null && typeof value === 'object' && 'type' in value && value.type === 'inherit';
}

/**
 * Gets the actual value from a style reference, considering inheritance
 * @param value The style reference to resolve
 * @param inheritedValue The value to use if the reference is inherited
 * @returns The resolved value, or undefined if no value is available
 */
export function resolveStyleReference<T>(
	value: TStyleReference<T> | undefined,
	inheritedValue?: T
): T | undefined {
	if (value == null) {
		return undefined;
	}

	if (isInheritedStyle(value)) {
		return inheritedValue;
	}

	return value;
}

/**
 * Creates a style reference from a value
 * @param value The value to reference, or 'inherit' to create an inherited reference
 */
export function createStyleReference<T>(value: T | 'inherit'): TStyleReference<T> {
	return value === 'inherit' ? inheritStyle() : value;
}
