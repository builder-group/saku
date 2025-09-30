import { TBaseMixin } from '@repo/editor';
import { TResolvedSolidPaint } from '../../lib';

export type TResolvedStrokeStyleMixin = TBaseMixin<
	'stroke',
	{
		width: number;
		paint: TResolvedSolidPaint;
		// Computed CSS styles
		styles: {
			border: React.CSSProperties['border'];
		};
	} | null
>;
