import { TBaseMixin, TBaseNode, TIdMixin, TMergeMixins } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedButtonStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextStyleMixin
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
		childMixins: Partial<
			TMergeMixins<
				[
					TResolvedAutoLayoutStyleMixin,
					TResolvedAppearanceStyleMixin,
					TResolvedFillStyleMixin,
					TResolvedStrokeStyleMixin,
					TResolvedShadowStyleMixin,
					TResolvedTextStyleMixin,
					TResolvedButtonStyleMixin
				]
			>
		>;
		watermarkColor: string;
	}
>;
