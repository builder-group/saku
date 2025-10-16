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

export type TResolvedAboutNode = TResolvedClassicAboutNodeBundle | TResolvedHeroAboutNodeBundle;

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

export type TResolvedHeroAboutNodeBundle = TNodeBundle<
	'hero',
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
		TResolvedTextStyleMixin
	]
>;
