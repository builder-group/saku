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
	TResolvedClassicMediaNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TMediaNodeMixin,
		TResolvedClassicMediaNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedClassicMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
		media?: {
			type: 'image' | 'video' | 'audio';
			altText?: string;
		} & TResolvedAsset;
	}
>;
