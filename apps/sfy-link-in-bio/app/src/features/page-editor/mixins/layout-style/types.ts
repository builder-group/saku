import { TMixin } from '@repo/editor';

export type TResolvedLayoutStyleMixin = TMixin<
	'layout',
	| {
			padding: number;
	  }
	| undefined
>;
