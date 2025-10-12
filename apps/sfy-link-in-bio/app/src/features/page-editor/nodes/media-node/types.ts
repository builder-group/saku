import { TBaseMixin, TIdMixin, TMediaNodeMixin, TNodeBundle } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin
} from '../../mixins';

export type TResolvedMediaNode = TResolvedClassicMediaNodeBundle;

export type TResolvedClassicMediaNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TMediaNodeMixin,
		TResolvedSingleMediaNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedSingleMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		media?: {
			type: 'image' | 'video' | 'audio';
			altText?: string;
		} & TResolvedAsset;
	}
>;
