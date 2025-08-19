import { TMixin } from '@repo/editor';
import { TResolvedPaint } from '../../lib';

export type TResolvedFillStyleMixin = TMixin<
	'fill',
	{
		paint: TResolvedPaint;
		// Computed CSS styles
		styles: {
			backgroundColor?: React.CSSProperties['backgroundColor'];
			backgroundImage?: React.CSSProperties['backgroundImage'];
		};
	} | null
>;
