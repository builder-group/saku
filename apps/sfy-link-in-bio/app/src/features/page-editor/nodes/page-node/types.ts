import { TBaseMixin, TBaseNode, TIdMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TBaseNode<
	TResolvedPageNodeMixin,
	[
		TIdMixin,
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
		content: {
			metadata: {
				title?: string;
				description?: string;
				image?: string;
			};
		};
	}
>;
