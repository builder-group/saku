import { TToken, TTokenRef } from '../types';

export function tokenRef(tokenType: TToken['type'], key = 'default'): TTokenRef {
	return { type: tokenType, key };
}
