import { TIdMixin, TNodeBundle, TTextNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedRichTextNodeContentMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedTextNode = TResolvedRichTextNodeBundle;

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
		TResolvedTextStyleMixin
	]
>;
