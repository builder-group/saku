import { TBaseMixin } from '@repo/editor';
import { TResolvedColor } from '../../lib';

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
