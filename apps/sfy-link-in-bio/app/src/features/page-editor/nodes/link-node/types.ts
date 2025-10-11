import { TBaseMixin, TIdMixin, TLinkNodeMixin, TNodeBundle } from '@repo/editor';
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

export type TResolvedLinkNode =
	| TResolvedClassicLinkNodeBundle
	| TResolvedYouTubeEmbedLinkNodeBundle
	| TResolvedSpotifyEmbedLinkNodeBundle;

export type TResolvedClassicLinkNodeBundle = TNodeBundle<
	TResolvedClassicLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedClassicLinkNodeContentMixin,
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

export type TResolvedYouTubeEmbedLinkNodeBundle = TNodeBundle<
	TResolvedYouTubeEmbedLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedYouTubeEmbedLinkNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedSpotifyEmbedLinkNodeBundle = TNodeBundle<
	TResolvedSpotifyEmbedLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedSpotifyEmbedLinkNodeContentMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin,
		TResolvedImageStyleMixin
	]
>;

export type TResolvedClassicLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'classic';
		url: string;
		title?: string;
		description?: string;
		favicon?: TResolvedAsset;
	}
>;

export type TResolvedYouTubeEmbedLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'youtube-embed';
		url: string;
		embedUrl: string;
	}
>;

export type TResolvedSpotifyEmbedLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'spotify-embed';
		url: string;
		embedUrl: string;
		height: number;
		theme?: TResolvedSpotifyEmbedTheme;
	}
>;

export interface TResolvedSpotifyEmbedTheme {
	backgroundBase?: TResolvedColor;
	backgroundTinted?: TResolvedColor;
	textBase?: TResolvedColor;
	textSubdued?: TResolvedColor;
}
