import { TGetTokenValue, TRef, TToken, TTokenPaths } from '../types';

export function tokenRef<
	GTokenType extends TToken['type'],
	GToken extends Extract<TToken, { type: GTokenType }>,
	GPath extends TTokenPaths<GToken> | undefined = undefined
>(
	tokenType: GTokenType,
	key = 'default',
	path?: GPath
): TRef<GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']> {
	return { type: 'token', key, tokenType, path } as TRef<
		GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']
	>;
}
