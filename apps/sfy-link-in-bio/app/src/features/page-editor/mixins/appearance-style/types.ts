import { TMixin } from '@repo/editor';

export type TResolvedAppearanceStyleMixin = TMixin<
	'appearance',
	| {
			borderRadius: number;
			opacity: number;
			visible: boolean;
	  }
	| undefined
>;
