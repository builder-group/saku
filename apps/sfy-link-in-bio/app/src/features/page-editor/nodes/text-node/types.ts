import { TIdMixin, TNodeBundle, TTextNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBasicTextNodeContentMixin,
	TResolvedFillStyleMixin,
	TResolvedRichTextNodeContentMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextBodyStyleMixin,
	TResolvedTextHeadingStyleMixin
} from '../../mixins';

export type TResolvedTextNode = TResolvedRichTextNodeBundle | TResolvedSectionTitleTextNodeBundle;

export type TResolvedRichTextNodeBundle = TNodeBundle<
	'rich',
	[
		TIdMixin,
		TTextNodeMixin,
		TResolvedRichTextNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextBodyStyleMixin
	]
>;

export type TResolvedSectionTitleTextNodeBundle = TNodeBundle<
	'section-title',
	[
		TIdMixin,
		TTextNodeMixin,
		TResolvedBasicTextNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTextHeadingStyleMixin
	]
>;
