import { TBaseMixin, TBaseNode, TIdMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedFillStyleMixin,
	TResolvedImageStyleMixin,
	TResolvedShadowStyleMixin,
	TResolvedSmTextStyleMixin,
	TResolvedStrokeStyleMixin,
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
		TResolvedSmTextStyleMixin,
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
	| TResolvedYouTubeVideoEmbedLinkNodeContent;

export interface TResolvedSingleLinkNodeContent {
	type: 'single';
	url: string;
	title?: string;
	description?: string;
	favicon?: TResolvedAsset;
}

export interface TResolvedYouTubeVideoEmbedLinkNodeContent {
	type: 'youtube-video-embed';
	url: string;
	embedUrl: string;
}
