import { TBaseMixin, TIdMixin, TNodeBundle, TTextNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedTextNode = TResolvedMarkdownTextNodeBundle;

export type TResolvedMarkdownTextNodeBundle = TNodeBundle<
	TResolvedMarkdownTextNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TTextNodeMixin,
		TResolvedMarkdownTextNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin
	]
>;

export type TResolvedMarkdownTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'markdown';
		text: string;
	}
>;
