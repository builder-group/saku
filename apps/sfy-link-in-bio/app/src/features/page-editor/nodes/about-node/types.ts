import { TBaseNode, TIdMixin, TMixin, TSocialLink } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../mixins';

export type TResolvedAboutNode = TBaseNode<
	TResolvedAboutNodeMixin,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedTypographyStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedAboutNodeMixin = TMixin<
	'node',
	{
		type: 'about';
		content: {
			name: string;
			bio?: string;
			profilePicture?: TResolvedAsset;
			socialLinks: TSocialLink[];
		};
	}
>;
