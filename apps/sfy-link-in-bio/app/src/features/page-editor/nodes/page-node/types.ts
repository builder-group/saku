import { TBaseMixin, TIdMixin, TNodeComposition } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TResolvedDefaultPageNodeComposition;

export type TResolvedDefaultPageNodeComposition = TNodeComposition<
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
