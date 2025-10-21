import { TIdMixin, TLinkNodeMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBasicLinkNodeContentMixin,
	TResolvedEmbedStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedSpotifyEmbedLinkNodeContentMixin,
	TResolvedStrokeStyleMixin,
	TResolvedTextBodyStyleMixin,
	TResolvedTextCaptionStyleMixin,
	TResolvedYouTubeEmbedLinkNodeContentMixin
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
		TResolvedTextBodyStyleMixin,
		TResolvedTextCaptionStyleMixin,
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
		TResolvedTextBodyStyleMixin,
		TResolvedTextCaptionStyleMixin,
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
		TResolvedEmbedStyleMixin
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
		TResolvedEmbedStyleMixin
	]
>;
