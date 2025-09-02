import { TBaseContentVariant, TBaseMixin, TBaseNode, TIdMixin, TRichContent } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedTextNode<
	GContent extends TResolvedTextNodeContent = TResolvedTextNodeContent
> = TBaseNode<
	TResolvedTextNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin
	]
>;

export type TResolvedTextNodeMixin<
	GContent extends TResolvedTextNodeContent = TResolvedTextNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'text';
		content: GContent;
	}
>;

export type TResolvedTextNodeContent = TResolvedDefaultTextNodeContent;

export interface TResolvedDefaultTextNodeContent extends TBaseContentVariant {
	type: 'default';
	text: TRichContent;
}
