export type TRef<T> = TTokenRef | TInheritRef | T;

export type TInheritRef = { type: 'inherit' }; // TODO: Remove once migrated to token references
export type TTokenRef = { type: 'token'; ref: string };

export type TUnreference<T> = T extends { type: 'token' }
	? never // Remove token completely
	: T extends { type: 'inherit' } // // TODO: Remove once migrated to token references
		? never // Remove inherit completely
		: T extends object
			? { [K in keyof T]: TUnreference<T[K]> }
			: T;

// TODO: Remove once migrated to token references
export type TUninherit<T> = T extends { type: 'inherit' } ? never : T;
