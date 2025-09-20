import { TToken, TTokenRef } from '../types';

export function tokenRef(type: TToken['type'], key = 'default', mapped = false): TTokenRef {
	return { type, key, mapped };
}
