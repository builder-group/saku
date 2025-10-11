import { TBaseMixin, TIdMixin, TNodeBundle, TRichContent, TTextNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedTextNode = TResolvedRichTextNodeBundle;

export type TResolvedRichTextNodeBundle = TNodeBundle<
	TResolvedRichTextNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TResolvedRichTextNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin
	]
>;

export type TResolvedRichTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'rich';
		text: TRichContent;
	}
>;
