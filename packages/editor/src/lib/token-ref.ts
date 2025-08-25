import { TTokenRef } from '../types';

export function tokenRef(ref: string = 'default'): TTokenRef {
	return { type: 'token', ref };
}
