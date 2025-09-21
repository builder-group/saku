import { TGetTokenValue, TToken, TTokenPaths, TTokenRef } from '../types';

export function tokenRef<
	GTokenType extends TToken['type'],
	GToken extends Extract<TToken, { type: GTokenType }>,
	GPath extends TTokenPaths<GToken> | undefined = undefined
>(
	key = 'default',
	tokenType?: GTokenType,
	path?: GPath
): TTokenRef<GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']> {
	return { type: 'token', key, tokenType, path } as TTokenRef<
		GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']
	>;
}
