import { TBaseMixin, TIdMixin, TLinkNodeMixin, TNodeComposition } from '@repo/editor';
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
	| TResolvedSingleLinkNodeComposition
	| TResolvedYouTubeEmbedLinkNodeComposition
	| TResolvedSpotifyEmbedLinkNodeComposition;

export type TResolvedSingleLinkNodeComposition = TNodeComposition<
	TResolvedSingleLinkNodeContentMixin['value']['type'],
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedSingleLinkNodeContentMixin,
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

export type TResolvedYouTubeEmbedLinkNodeComposition = TNodeComposition<
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

export type TResolvedSpotifyEmbedLinkNodeComposition = TNodeComposition<
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

export type TResolvedSingleLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
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
