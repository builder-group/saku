import { TBaseNode, TIdMixin, TMergeMixins, TMixin, TPageLayoutStyleMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TBaseNode<
	TResolvedPageNodeMixin,
	[
		TIdMixin,
		TResolvedChildrenMixin,
		TPageLayoutStyleMixin,
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
		childDefaults: TMergeMixins<
			[
				TResolvedLayoutStyleMixin,
				TResolvedAppearanceStyleMixin,
				TResolvedTypographyStyleMixin,
				TResolvedFillStyleMixin,
				TResolvedStrokeStyleMixin,
				TResolvedShadowStyleMixin
			]
		>;
		watermarkColor: string;
	}
>;
