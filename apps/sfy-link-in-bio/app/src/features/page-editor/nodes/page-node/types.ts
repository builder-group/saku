import { TBaseMixin, TIdMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TResolvedClassicPageNodeBundle;

export type TResolvedClassicPageNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TResolvedPageNodeMixin,
		TResolvedChildrenMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin
	]
>;

export type TResolvedPageNodeMixin = TBaseMixin<
	'node',
	{
		type: 'page';
		metadata: {
			title: string;
			description: string;
			favicon: string;
			image?: string;
		};
		hasWatermark: boolean;
	}
>;
