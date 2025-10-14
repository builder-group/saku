import {
	TClassicLinkNodeBundle,
	TFeaturedLinkNodeBundle,
	TLinkNode,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../lib';
import {
	ClassicBundleStyleEditor,
	FeaturedBundleStyleEditor,
	SpotifyEmbedBundleStyleEditor,
	YouTubeEmbedBundleStyleEditor
} from '../bundles';

export const LinkNodeStyleEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicBundleStyleEditor
					nodeState={nodeState as TNodeState<TClassicLinkNodeBundle>}
					{...rest}
				/>
			);
		case 'featured':
			return (
				<FeaturedBundleStyleEditor
					nodeState={nodeState as TNodeState<TFeaturedLinkNodeBundle>}
					{...rest}
				/>
			);
		case 'youtube-embed':
			return (
				<YouTubeEmbedBundleStyleEditor
					nodeState={nodeState as TNodeState<TYouTubeEmbedLinkNodeBundle>}
					{...rest}
				/>
			);
		case 'spotify-embed':
			return (
				<SpotifyEmbedBundleStyleEditor
					nodeState={nodeState as TNodeState<TSpotifyEmbedLinkNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
