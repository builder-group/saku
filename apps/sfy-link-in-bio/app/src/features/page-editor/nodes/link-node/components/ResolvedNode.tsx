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
	const { node, ...rest } = props;

	switch (node.bundleType) {
		case 'classic':
			return <ResolvedClassicBundle ref={ref} node={node} {...rest} />;
		case 'featured':
			return <ResolvedFeaturedBundle ref={ref} node={node} {...rest} />;
		case 'youtube-embed':
			return <ResolvedYouTubeEmbedBundle ref={ref} node={node} {...rest} />;
		case 'spotify-embed':
			return <ResolvedSpotifyEmbedBundle ref={ref} node={node} {...rest} />;
		default:
			return null;
	}
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
