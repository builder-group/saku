import {
	TLinkNode,
	TSingleLinkNodeComposition,
	TSpotifyEmbedLinkNodeComposition,
	TYouTubeEmbedLinkNodeComposition
} from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../../lib';
import { SingleLinkStyleEditor } from './SingleStyle';
import { SpotifyEmbedStyleEditor } from './SpotifyEmbedStyle';
import { YouTubeEmbedStyleEditor } from './YoutubeEmbedStyle';

export const LinkNodeStyleEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const composition = useCompute(nodeState, ({ value }) => value.composition);

	switch (composition) {
		case 'single':
			return (
				<SingleLinkStyleEditor
					nodeState={nodeState as TNodeState<TSingleLinkNodeComposition>}
					{...rest}
				/>
			);
		case 'youtube-embed':
			return (
				<YouTubeEmbedStyleEditor
					nodeState={nodeState as TNodeState<TYouTubeEmbedLinkNodeComposition>}
					{...rest}
				/>
			);
		case 'spotify-embed':
			return (
				<SpotifyEmbedStyleEditor
					nodeState={nodeState as TNodeState<TSpotifyEmbedLinkNodeComposition>}
					{...rest}
				/>
			);
		default:
			return null;
	}
};
