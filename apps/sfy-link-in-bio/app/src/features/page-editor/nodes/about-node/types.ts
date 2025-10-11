import { TAboutNodeMixin, TBaseMixin, TContactIcon, TIdMixin, TNodeBundle } from '@repo/editor';
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

export type TResolvedAboutNode = TResolvedDefaultAboutNodeBundle;

export type TResolvedDefaultAboutNodeBundle = TNodeBundle<
	TResolvedDefaultAboutNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TAboutNodeMixin,
		TResolvedDefaultAboutNodeContentMixin,
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

export type TResolvedDefaultAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'default';
		name: string;
		bio?: string;
		profilePicture?: TResolvedAsset;
		contactIcons: TContactIcon[];
	}
>;
