import { TToken, TTokenRef } from '../types';

export function tokenRef<GToken extends TToken = TToken>(
	type: GToken['type'],
	key = 'default',
	mapped = false
): TTokenRef<GToken> {
	return { type, key, mapped };
}
