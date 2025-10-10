import {
	TAboutNodeMixin,
	TBaseMixin,
	TBaseNode,
	TComposition,
	TContactIcon,
	TIdMixin
} from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin,
	TResolvedTextXlStyleMixin
} from '../../mixins';

export type TResolvedAboutNode = TBaseNode<'about', TResolvedDefaultAboutComposition>;

export type TResolvedDefaultAboutComposition = TComposition<
	'default',
	[
		TIdMixin,
		TAboutNodeMixin,
		TResolvedDefaultAboutContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextXlStyleMixin,
		TResolvedTextStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedDefaultAboutContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		name: string;
		bio?: string;
		profilePicture?: TResolvedAsset;
		contactIcons: TContactIcon[];
	}
>;
