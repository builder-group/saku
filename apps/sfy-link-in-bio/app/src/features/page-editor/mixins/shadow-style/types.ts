import { TBaseMixin } from '@repo/editor';
import { TResolvedSolidPaint } from '../../lib';

export type TResolvedShadowStyleMixin = TBaseMixin<
	'shadow',
	{
		paint: TResolvedSolidPaint;
		offsetX: number;
		offsetY: number;
		blur: number;
		spread: number;
		// Computed CSS styles
		styles: {
			boxShadow: React.CSSProperties['boxShadow'];
		};
	} | null
>;
