import { TGetTokenValue, TToken, TTokenPaths, TTokenRef } from '../types';

export function tokenRef<
	GTokenType extends TToken['type'],
	GToken extends Extract<TToken, { type: GTokenType }>,
	GPath extends TTokenPaths<GToken> | undefined = undefined
>(
	key = 'default',
	tokenType: GTokenType,
	path?: GPath
): TTokenRef<GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']> {
	return { type: 'token', key, tokenType, path } as TTokenRef<
		GPath extends string ? TGetTokenValue<GToken, GPath> : GToken['value']
	>;
}

export function mapTokenRef<
	GTokenValue extends TToken['value'],
	GToken extends Extract<TToken, { value: GTokenValue }>,
	GPath extends TTokenPaths<GToken>
>(fromRef: TTokenRef<GTokenValue>, toPath: GPath): TTokenRef<TGetTokenValue<GToken, GPath>> {
	return {
		type: 'token',
		key: fromRef.key,
		tokenType: fromRef.tokenType,
		path: (fromRef.path != null ? `${fromRef.path}.${toPath}` : toPath) as GPath
	};
}
