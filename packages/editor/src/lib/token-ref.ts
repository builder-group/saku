import { TTokenRef, TTokenType } from '../types';

export function tokenRef(tokenType: TTokenType = 'mixin', key = 'default'): TTokenRef {
	return { type: 'token', tokenType, key };
}
