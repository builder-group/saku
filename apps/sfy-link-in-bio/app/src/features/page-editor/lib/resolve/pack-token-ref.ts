import { isTokenRef, TRef, TToken, TTokenPaths, TTokenRef, TUnreferenceTop } from '@repo/editor';

/**
 * Packs a mixin value back to a token reference if all properties reference the same token.
 * If not all properties reference the same token, returns the original value.
 *
 * @param value - The mixin value to pack
 * @param properties - Array of property names to check for token references
 */
export function packTokenRef<
	GTokenValue extends TToken['value'],
	GToken extends Extract<TToken, { value: GTokenValue }>,
	GPath extends TTokenPaths<GToken>
>(
	value: TUnreferenceTop<TRef<GTokenValue, GToken>>,
	properties: readonly GPath[]
): TRef<GTokenValue, GToken> {
	// Find the first token reference to use as the base
	let baseTokenRef: TTokenRef | null = null;

	for (const key of properties) {
		const propValue = value?.[key];
		if (isTokenRef(propValue)) {
			if (baseTokenRef == null) {
				baseTokenRef = propValue;
			}
			// Different token type found, can't pack
			else if (propValue.tokenType !== baseTokenRef.tokenType) {
				return value;
			}
		}
		// Non-token reference found, can't pack
		else {
			return value;
		}
	}

	return baseTokenRef as TRef<GTokenValue, GToken>;
}
