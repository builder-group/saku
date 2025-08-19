import { TBaseNode, TIdMixin, TMergeMixins, TMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedPageLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TBaseNode<
	TResolvedPageNodeMixin,
	[
		TIdMixin,
		TResolvedChildrenMixin,
		TResolvedPageLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin
	]
>;

export type TResolvedPageNodeMixin = TMixin<
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
					TResolvedLayoutStyleMixin,
					TResolvedAppearanceStyleMixin,
					TResolvedTypographyStyleMixin,
					TResolvedFillStyleMixin,
					TResolvedStrokeStyleMixin,
					TResolvedShadowStyleMixin
				]
			>
		>;
		watermarkColor: string;
	}
>;
