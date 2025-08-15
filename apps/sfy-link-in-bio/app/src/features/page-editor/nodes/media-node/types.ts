import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedLayoutStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin
} from '../../mixins';

export type TResolvedMediaNode<GMedia extends TResolvedMedia = TResolvedMedia> = TBaseNode<
	TResolvedMediaNodeMixin<GMedia>,
	[
		TIdMixin,
		TResolvedLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedStrokeStyleMixin,
		TResolvedShadowStyleMixin
	]
>;

export type TResolvedMediaNodeMixin<GMedia extends TResolvedMedia = TResolvedMedia> = TMixin<
	'node',
	{ type: 'media'; content: { media?: GMedia } }
>;

export type TResolvedMedia = TResolvedImageMedia;

export interface TResolvedImageMedia {
	type: 'image';
	url: string; // Resolved URL or base64
	altText?: string;
}
