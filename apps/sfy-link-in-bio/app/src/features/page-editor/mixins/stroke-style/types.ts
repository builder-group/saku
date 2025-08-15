import { TMixin } from '@repo/editor';

export type TResolvedStrokeStyleMixin = TMixin<
	'stroke',
	| {
			width: number;
			color: string;
	  }
	| undefined
>;
