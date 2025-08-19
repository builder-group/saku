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
			backgroundSize?: React.CSSProperties['backgroundSize'];
			backgroundPosition?: React.CSSProperties['backgroundPosition'];
			backgroundRepeat?: React.CSSProperties['backgroundRepeat'];
		};
	} | null
>;
