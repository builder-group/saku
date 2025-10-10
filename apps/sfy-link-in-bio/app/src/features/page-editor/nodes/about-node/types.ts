import {
	TAboutNodeMixin,
	TBaseMixin,
	TContactIcon,
	TIdMixin,
	TNodeComposition
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

export type TResolvedAboutNode = TResolvedDefaultAboutComposition;

export type TResolvedDefaultAboutComposition = TNodeComposition<
	TResolvedDefaultAboutContentMixin['value']['type'],
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
