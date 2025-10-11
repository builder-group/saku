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

export type TResolvedAboutNode = TResolvedClassicAboutNodeBundle;

export type TResolvedClassicAboutNodeBundle = TNodeBundle<
	TResolvedClassicAboutNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TAboutNodeMixin,
		TResolvedClassicAboutNodeContentMixin,
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

export type TResolvedClassicAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
		name: string;
		bio?: string;
		profilePicture?: TResolvedAsset;
		contactIcons: TContactIcon[];
	}
>;
