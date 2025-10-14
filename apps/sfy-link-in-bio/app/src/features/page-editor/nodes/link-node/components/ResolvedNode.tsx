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
	const { node, cx, ...divProps } = props;

	const renderBundle = React.useCallback(() => {
		switch (node.bundleType) {
			case 'classic':
				return <ResolvedClassicBundle node={node} cx={cx} />;
			case 'featured':
				return <ResolvedFeaturedBundle node={node} cx={cx} />;
			case 'youtube-embed':
				return <ResolvedYouTubeEmbedBundle node={node} cx={cx} />;
			case 'spotify-embed':
				return <ResolvedSpotifyEmbedBundle node={node} cx={cx} />;
			default:
				return null;
		}
	}, [node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderBundle()}
		</div>
	);
});
ResolvedLinkNode.displayName = 'ResolvedLinkNode';
