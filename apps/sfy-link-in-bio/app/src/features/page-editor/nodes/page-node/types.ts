import { TBaseContentVariant, TBaseMixin, TBaseNode, TIdMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin
} from '../../mixins';

export type TResolvedPageNode<
	GContent extends TResolvedPageNodeContent = TResolvedPageNodeContent
> = TBaseNode<
	TResolvedPageNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedChildrenMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin
	]
>;

export type TResolvedPageNodeMixin<
	GContent extends TResolvedPageNodeContent = TResolvedPageNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'page';
		content: GContent;
		metadata: {
			title: string;
			description: string;
			favicon: string;
			image?: string;
		};
	}
>;

export type TResolvedPageNodeContent = TResolvedDefaultPageNodeContent;

export interface TResolvedDefaultPageNodeContent extends TBaseContentVariant {
	type: 'default';
	hasWatermark: boolean;
}
