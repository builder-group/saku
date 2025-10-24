import { TIdMixin, TNodeBundle, TProductNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBadgeNeutralStyleMixin,
	TResolvedBadgeSecondaryStyleMixin,
	TResolvedBannerStyleMixin,
	TResolvedButtonPrimaryStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedProductDetailsStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedSingleProductNodeContentMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextBodyStyleMixin
} from '../../mixins';

export type TResolvedProductNode = TResolvedClassicProductNodeBundle;

export type TResolvedClassicProductNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TProductNodeMixin,
		TResolvedSingleProductNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextBodyStyleMixin,
		TResolvedButtonPrimaryStyleMixin,
		TResolvedBadgeSecondaryStyleMixin,
		TResolvedBadgeNeutralStyleMixin,
		TResolvedBannerStyleMixin,
		TResolvedImageStyleMixin,
		TResolvedProductDetailsStyleMixin
	]
>;
