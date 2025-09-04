import { TTokenRef, TTokenType } from '../types';

export function tokenRef(key = 'default', tokenType: TTokenType = 'mixin'): TTokenRef {
	return { type: 'token', tokenType, key };
}
