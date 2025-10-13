import { TBaseMixin, TIdMixin, TLinkNodeMixin, TNodeBundle } from '@repo/editor';
import { TResolvedColor } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBasicLinkNodeContentMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextSmStyleMixin,
	TResolvedTextStyleMixin
} from '../../mixins';

export type TResolvedLinkNode =
	| TResolvedClassicLinkNodeBundle
	| TResolvedFeaturedLinkNodeBundle
	| TResolvedYouTubeEmbedLinkNodeBundle
	| TResolvedSpotifyEmbedLinkNodeBundle;

export type TResolvedClassicLinkNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedBasicLinkNodeContentMixin,
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

export type TResolvedFeaturedLinkNodeBundle = TNodeBundle<
	'featured',
	[
		TIdMixin,
		TLinkNodeMixin,
		TResolvedBasicLinkNodeContentMixin,
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
	'youtube-embed',
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
	'spotify-embed',
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
