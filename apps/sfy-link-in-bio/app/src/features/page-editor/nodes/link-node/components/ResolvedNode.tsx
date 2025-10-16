import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import {
	ResolvedClassicBundle,
	ResolvedFeaturedBundle,
	ResolvedSpotifyEmbedBundle,
	ResolvedYouTubeEmbedBundle
} from '../bundles';
import { TResolvedLinkNode } from '../types';

export const ResolvedLinkNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedLinkNode>
>((props, ref) => {
	const { node, cx } = props;

	switch (node.bundleType) {
		case 'classic':
			return <ResolvedClassicBundle ref={ref} node={node} cx={cx} />;
		case 'featured':
			return <ResolvedFeaturedBundle ref={ref} node={node} cx={cx} />;
		case 'youtube-embed':
			return <ResolvedYouTubeEmbedBundle ref={ref} node={node} cx={cx} />;
		case 'spotify-embed':
			return <ResolvedSpotifyEmbedBundle ref={ref} node={node} cx={cx} />;
		default:
			return null;
	}
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
