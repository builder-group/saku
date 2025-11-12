import { TIdMixin, TMediaNodeMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAnimationStyleMixin,
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedSingleMediaNodeContentMixin,
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
		TResolvedAnimationStyleMixin,
		TResolvedImageStyleMixin
	]
>;
