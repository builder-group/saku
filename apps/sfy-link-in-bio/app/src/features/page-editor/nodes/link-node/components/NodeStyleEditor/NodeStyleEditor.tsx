import {
	TClassicLinkNodeBundle,
	TLinkNode,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeEditorComponentProps, TNodeState } from '../../../../lib';
import { ClassicStyleEditor } from './ClassicStyleEditor';
import { SpotifyEmbedStyleEditor } from './SpotifyEmbedStyle';
import { YouTubeEmbedStyleEditor } from './YoutubeEmbedStyle';

export const LinkNodeStyleEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, ...rest } = props;
	const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

	switch (bundleType) {
		case 'classic':
			return (
				<ClassicStyleEditor nodeState={nodeState as TNodeState<TClassicLinkNodeBundle>} {...rest} />
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
