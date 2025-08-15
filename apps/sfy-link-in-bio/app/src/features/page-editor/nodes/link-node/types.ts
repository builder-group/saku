import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
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
