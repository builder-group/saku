// TODO: Remove once migrated to token references

import { TRef, TUninherit } from '../types';
import { isTokenRef } from './is-token-ref';

/**
 * Creates an inherited style reference
 */
export function inherit<T>(): TRef<T> {
	return { type: 'inherit' } as TRef<T>;
}

/**
 * Checks if a style reference is inherited
 */
export function isInherited<T>(value: TRef<T> | undefined): value is TRef<T> & { type: 'inherit' } {
	return value != null && typeof value === 'object' && 'type' in value && value.type === 'inherit';
}

/**
 * Gets the actual value from a style reference, considering inheritance
 * @param value The style reference to resolve
 * @param inheritedValue The value to use if the reference is inherited
 * @returns The resolved value
 */
export function resolveReference<T>(value: TRef<T>, inheritedValue: T): T;
export function resolveReference<T>(value?: TRef<T>): T | undefined;
export function resolveReference<T>(value?: TRef<T>, inheritedValue?: T): T | undefined {
	if (isInherited(value)) {
		return inheritedValue;
	}
	if (isTokenRef(value)) {
		throw new Error('Token references cannot be resolved');
	}
	return value;
}

/**
 * Creates a style reference from a value
 * @param value The value to reference, or 'inherit' to create an inherited reference
 */
export function createReference<T>(value: T | 'inherit'): TRef<T> {
	return value === 'inherit' ? inherit() : (value as TRef<T>);
}

/**
 * Creates a TRef wrapper around a value
 * @param value The value to wrap in a TRef
 * @returns A TRef<T> containing the value
 */
export function ref<T>(value: T): TRef<T> {
	return value as TRef<T>;
}

export function uninherit<T>(value: T): TUninherit<T> {
	if (isInherited(value)) {
		throw new Error('Cannot uninherit a value that is an inherit ref');
	}
	return value as TUninherit<T>;
}
