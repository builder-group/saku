import { TBaseContentVariant, TBaseMixin, TBaseNode, TContactIcon, TIdMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin,
	TResolvedXlTextStyleMixin
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
		TResolvedXlTextStyleMixin,
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
	contactIcons: TContactIcon[];
}
