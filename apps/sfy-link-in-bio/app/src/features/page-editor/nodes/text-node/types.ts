import { TBaseMixin, TIdMixin, TNodeComposition, TRichContent, TTextNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedTextNode = TResolvedDefaultTextNodeComposition;

export type TResolvedDefaultTextNodeComposition = TNodeComposition<
	TResolvedDefaultTextNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TResolvedDefaultTextNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin
	]
>;

export type TResolvedDefaultTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		text: TRichContent;
	}
>;
