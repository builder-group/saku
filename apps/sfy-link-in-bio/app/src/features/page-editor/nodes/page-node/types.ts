import { TBaseMixin, TIdMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TResolvedDefaultPageNodeBundle;

export type TResolvedDefaultPageNodeBundle = TNodeBundle<
	'default',
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
