import { TAboutNodeMixin, TIdMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBasicAboutNodeContentMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin,
	TResolvedTextXlStyleMixin
} from '../../mixins';

export type TResolvedAboutNode = TResolvedClassicAboutNodeBundle;

export type TResolvedClassicAboutNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TAboutNodeMixin,
		TResolvedBasicAboutNodeContentMixin,
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
