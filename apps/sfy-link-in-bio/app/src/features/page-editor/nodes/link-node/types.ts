import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../mixins';

export type TResolvedLinkNode<GVariant extends TResolvedLinkVariant = TResolvedLinkVariant> =
	TBaseNode<
		TResolvedLinkNodeMixin<GVariant>,
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

export type TResolvedLinkNodeMixin<GVariant extends TResolvedLinkVariant = TResolvedLinkVariant> =
	TMixin<
		'node',
		{
			type: 'link';
			content: {
				url: string;
				variant: GVariant;
			};
		}
	>;

export type TResolvedLinkVariant =
	| TResolvedDefaultLinkVariant
	// | TResolvedYouTubeVideoLinkVariant
	// | TResolvedYouTubeChannelLinkVariant
	| TResolvedYouTubeVideoEmbedLinkVariant;

export interface TResolvedDefaultLinkVariant {
	type: 'default';
	title?: string;
	description?: string;
	favicon?: TResolvedAsset;
}

export interface TResolvedYouTubeVideoLinkVariant {
	type: 'youtube-video';
	title?: string;
	thumbnail?: TResolvedAsset;
}

export interface TResolvedYouTubeChannelLinkVariant {
	type: 'youtube-channel';
	title?: string;
	avatar?: TResolvedAsset;
}

export interface TResolvedYouTubeVideoEmbedLinkVariant {
	type: 'youtube-video-embed';
	embedUrl: string;
}
