import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import {
	TResolvedClassicLinkNodeBundle,
	TResolvedFeaturedLinkNodeBundle,
	TResolvedLinkNode,
	TResolvedSpotifyEmbedLinkNodeBundle,
	TResolvedYouTubeEmbedLinkNodeBundle
} from '../../types';
import { ClassicContent } from './ClassicContent';
import { FeaturedContent } from './FeaturedContent';
import { SpotifyEmbedContent } from './SpotifyEmbedContent';
import { YouTubeEmbedContent } from './YouTubeEmbedContent';

export const ResolvedLinkNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedLinkNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;

	const renderContent = React.useCallback(() => {
		switch (node.bundleType) {
			case 'classic':
				return <ClassicContent node={node as TResolvedClassicLinkNodeBundle} cx={cx} />;
			case 'featured':
				return <FeaturedContent node={node as TResolvedFeaturedLinkNodeBundle} cx={cx} />;
			case 'youtube-embed':
				return <YouTubeEmbedContent node={node as TResolvedYouTubeEmbedLinkNodeBundle} cx={cx} />;
			case 'spotify-embed':
				return <SpotifyEmbedContent node={node as TResolvedSpotifyEmbedLinkNodeBundle} cx={cx} />;
			default:
				return null;
		}
	}, [node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
