import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTypographyStyleMixin
} from '../../lib';

export type TResolvedLinkNode = TBaseNode<
	TResolvedLinkNodeMixin,
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

export type TResolvedLinkNodeMixin = TMixin<
	'node',
	{
		type: 'link';
		content: {
			url: string;
			variant?: TResolvedLinkVariant;
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
	favicon?: string;
}

export interface TResolvedYouTubeVideoLinkVariant {
	type: 'youtube-video';
	title?: string;
	thumbnail?: string;
}

export interface TResolvedYouTubeChannelLinkVariant {
	type: 'youtube-channel';
	title?: string;
	avatar?: string;
}

export interface TResolvedYouTubeVideoEmbedLinkVariant {
	type: 'youtube-video-embed';
	videoId: string;
}
