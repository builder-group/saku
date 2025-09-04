import { TBaseContentVariant, TBaseMixin, TBaseNode, TIdMixin, TSocialLink } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedHeadingTextStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedAboutNode<
	GContent extends TResolvedAboutNodeContent = TResolvedAboutNodeContent
> = TBaseNode<
	TResolvedAboutNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedHeadingTextStyleMixin,
		TResolvedTextStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedAboutNodeMixin<
	GContent extends TResolvedAboutNodeContent = TResolvedAboutNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'about';
		content: GContent;
	}
>;

export type TResolvedAboutNodeContent = TResolvedDefaultAboutNodeContent;

export interface TResolvedDefaultAboutNodeContent extends TBaseContentVariant {
	type: 'default';
	name: string;
	bio?: string;
	profilePicture?: TResolvedAsset;
	socialLinks: TSocialLink[];
}
