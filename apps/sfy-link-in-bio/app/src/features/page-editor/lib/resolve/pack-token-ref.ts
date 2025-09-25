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
	let baseTokenRef: TTokenRef | null = null;

	for (const key of properties) {
		const propValue = value?.[key];
		if (isTokenRef(propValue)) {
			const basePathStr = propValue.path?.split('.').slice(0, -1).join('.');
			const basePath = !basePathStr ? undefined : basePathStr;

			// Use the first token reference to use as the base
			if (baseTokenRef == null) {
				baseTokenRef = {
					type: 'token',
					key: propValue.key,
					tokenType: propValue.tokenType,
					path: basePath as GPath
				};
			}
			// Different token type found, can't pack
			else if (propValue.tokenType !== baseTokenRef.tokenType) {
				return value;
			}
			// Different base path found, can't pack
			else if (basePath !== baseTokenRef.path) {
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
