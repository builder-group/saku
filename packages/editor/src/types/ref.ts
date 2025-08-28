export type TRef<T> = TTokenRef | T;

export interface TTokenRef {
	type: 'token';
	key: string;
}

export type TUnreference<T> = T extends { type: 'token' }
	? never // Remove token completely
	: T extends object
		? { [K in keyof T]: TUnreference<T[K]> }
		: T;
