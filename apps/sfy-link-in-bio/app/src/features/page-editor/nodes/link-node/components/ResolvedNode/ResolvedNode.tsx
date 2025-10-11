import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import {
	TResolvedLinkNode,
	TResolvedSingleLinkNodeBundle,
	TResolvedSpotifyEmbedLinkNodeBundle,
	TResolvedYouTubeEmbedLinkNodeBundle
} from '../../types';
import { DefaultContent } from './SingleContent';
import { SpotifyEmbedContent } from './SpotifyEmbedContent';
import { YouTubeEmbedContent } from './YouTubeEmbedContent';

export const ResolvedLinkNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedLinkNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	const renderContent = React.useCallback(() => {
		switch (content.type) {
			case 'single':
				return <DefaultContent node={node as TResolvedSingleLinkNodeBundle} cx={cx} />;
			case 'youtube-embed':
				return <YouTubeEmbedContent node={node as TResolvedYouTubeEmbedLinkNodeBundle} cx={cx} />;
			case 'spotify-embed':
				return <SpotifyEmbedContent node={node as TResolvedSpotifyEmbedLinkNodeBundle} cx={cx} />;
			default:
				return null;
		}
	}, [content.type, node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
