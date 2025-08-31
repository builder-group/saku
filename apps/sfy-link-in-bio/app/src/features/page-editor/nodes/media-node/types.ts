import { TBaseContentVariant, TBaseMixin, TBaseNode, TIdMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin
} from '../../mixins';

export type TResolvedMediaNode<
	GContent extends TResolvedMediaNodeContent = TResolvedMediaNodeContent
> = TBaseNode<
	TResolvedMediaNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedMediaNodeMixin<
	GContent extends TResolvedMediaNodeContent = TResolvedMediaNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'media';
		content: GContent;
	}
>;

export type TResolvedMediaNodeContent = TResolvedImageMediaNodeContent;

export interface TResolvedImageMediaNodeContent extends TBaseContentVariant {
	type: 'image';
	media?: {
		altText?: string;
	} & TResolvedAsset;
}
