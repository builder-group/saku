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

export type TResolvedMediaNode = TResolvedImageMediaNodeBundle;

export type TResolvedImageMediaNodeBundle = TNodeBundle<
	TResolvedImageMediaNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TMediaNodeMixin,
		TResolvedImageMediaNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedImageMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'image';
		media?: {
			altText?: string;
		} & TResolvedAsset;
	}
>;
