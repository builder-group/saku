import {
	TLinkNode,
	TSingleLinkNodeBundle,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../../lib';
import { SingleLinkStyleEditor } from './SingleStyle';
import { SpotifyEmbedStyleEditor } from './SpotifyEmbedStyle';
import { YouTubeEmbedStyleEditor } from './YoutubeEmbedStyle';

export const LinkNodeStyleEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundle);

	switch (bundleType) {
		case 'single':
			return (
				<SingleLinkStyleEditor
					nodeState={nodeState as TNodeState<TSingleLinkNodeBundle>}
					{...rest}
				/>
			);
		case 'youtube-embed':
			return (
				<YouTubeEmbedStyleEditor
					nodeState={nodeState as TNodeState<TYouTubeEmbedLinkNodeBundle>}
					{...rest}
				/>
			);
		case 'spotify-embed':
			return (
				<SpotifyEmbedStyleEditor
					nodeState={nodeState as TNodeState<TSpotifyEmbedLinkNodeBundle>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
