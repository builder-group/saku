import { TMixin } from '@repo/editor';
import { TResolvedPaint } from '../../lib';

export type TResolvedFillStyleMixin = TMixin<
	'fill',
	{
		paint: TResolvedPaint;
		opacity: number;
	}
>;
