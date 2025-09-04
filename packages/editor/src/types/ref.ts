import { TTokenRef } from './token';

export type TRef<T> = TTokenRef | T;

export type TUnreference<T> = T extends { type: 'token' }
	? never // Remove token completely
	: T extends object
		? { [K in keyof T]: TUnreference<T[K]> }
		: T;
