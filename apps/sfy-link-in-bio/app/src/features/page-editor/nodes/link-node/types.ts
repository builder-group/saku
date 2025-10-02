import { TBaseMixin, TBaseNode, TIdMixin } from '@repo/editor';
import { TResolvedAsset, TResolvedColor } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextSmStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedLinkNode<
	GContent extends TResolvedLinkNodeContent = TResolvedLinkNodeContent
> = TBaseNode<
	TResolvedLinkNodeMixin<GContent>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedTextStyleMixin,
		TResolvedTextSmStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedLinkNodeMixin<
	GContent extends TResolvedLinkNodeContent = TResolvedLinkNodeContent
> = TBaseMixin<
	'node',
	{
		type: 'link';
		content: GContent;
	}
>;

export type TResolvedLinkNodeContent =
	| TResolvedSingleLinkNodeContent
	| TResolvedYouTubeEmbedLinkNodeContent
	| TResolvedSpotifyEmbedLinkNodeContent;

export interface TResolvedSingleLinkNodeContent {
	type: 'single';
	url: string;
	title?: string;
	description?: string;
	favicon?: TResolvedAsset;
}

export interface TResolvedYouTubeEmbedLinkNodeContent {
	type: 'youtube-embed';
	url: string;
	embedUrl: string;
}

export interface TResolvedSpotifyEmbedLinkNodeContent {
	type: 'spotify-embed';
	url: string;
	embedUrl: string;
	height: number;
	theme?: TResolvedSpotifyEmbedTheme;
}

export interface TResolvedSpotifyEmbedTheme {
	backgroundBase?: TResolvedColor;
	backgroundTinted?: TResolvedColor;
	textBase?: TResolvedColor;
	textSubdued?: TResolvedColor;
}
