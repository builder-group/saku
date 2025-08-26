import { TRef, TTokenType } from '../types';
import { isInherited } from './inherit-ref';
import { isTokenRef } from './is-token-ref';

export function resolveRef<GValue, GTokenType extends TTokenType>(
	type: GTokenType,
	value?: TRef<GValue>,
	tokens?: Record<GTokenType, Record<string, GValue>>
): GValue | undefined {
	if (isTokenRef(value)) {
		return tokens?.[type][value.ref] as GValue;
	}
	if (isInherited(value)) {
		// TODO: Remove once migrated to token references
		throw new Error('Inherited references cannot be resolved');
	}
	return value;
}
