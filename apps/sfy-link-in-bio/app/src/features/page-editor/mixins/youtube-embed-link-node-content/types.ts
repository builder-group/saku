import { TBaseMixin } from '@repo/editor';

export type TResolvedYouTubeEmbedLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'youtube-embed';
		url: string;
		embedUrl: string;
	}
>;
