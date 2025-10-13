import { TIdMixin, TNodeBundle, TProductNodeMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBadgeNeutralStyleMixin,
	TResolvedBadgeSecondaryStyleMixin,
	TResolvedButtonPrimaryStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedProductDetailsStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedSingleProductNodeContentMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
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
		TResolvedTextStyleMixin,
		TResolvedButtonPrimaryStyleMixin,
		TResolvedBadgeSecondaryStyleMixin,
		TResolvedBadgeNeutralStyleMixin,
		TResolvedImageStyleMixin,
		TResolvedProductDetailsStyleMixin
	]
>;
