import { TAnimation, TBaseMixin } from '@repo/editor';

export type TResolvedAnimationStyleMixin = TBaseMixin<
	'animation',
	{
		animation: {
			type: TAnimation['type'];
			duration: number;
		};
		// Computed CSS styles
		styles: {
			animationName: string;
			animationDuration: string;
			animationIterationCount: number | 'infinite';
			animationTimingFunction: string;
			animationFillMode: string;
		};
	} | null
>;
