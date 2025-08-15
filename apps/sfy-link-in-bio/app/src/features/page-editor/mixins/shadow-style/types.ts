import { TMixin } from '@repo/editor';

export type TResolvedShadowStyleMixin = TMixin<
	'shadow',
	| {
			color: string;
			offsetX: number;
			offsetY: number;
			blur: number;
			spread: number;
	  }
	| undefined
>;
