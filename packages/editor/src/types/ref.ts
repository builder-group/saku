import { TTokenRef } from './token';

export type TRef<T> = TTokenRef | T;

export type TUnreference<T> = T extends TTokenRef
	? never // Remove token completely
	: T extends object
		? { [K in keyof T]: TUnreference<T[K]> }
		: T;

export type TUnreferenceTop<T> = T extends TTokenRef ? never : T;
