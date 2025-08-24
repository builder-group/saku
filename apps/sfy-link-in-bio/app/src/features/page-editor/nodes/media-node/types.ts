import { TBaseNode, TIdMixin, TMixin } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedStrokeStyleMixin
} from '../../mixins';

export type TResolvedMediaNode<GMedia extends TResolvedMedia = TResolvedMedia> = TBaseNode<
	TResolvedMediaNodeMixin<GMedia>,
	[
		TIdMixin,
		TResolvedAutoLayoutStyleMixin,
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
	src: string;
	altText?: string;
}
