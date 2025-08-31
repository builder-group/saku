import { TLinkNode, TYouTubeVideoEmbedLinkNodeContent } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useCompute, useListener } from 'feature-react/state';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../../lib';
import { extractYouTubeVideoId } from './lib';

export const YoutubeVideoEmbedContent: React.FC<TYoutubeVideoEmbedContentProps> = (props) => {
	const { nodeState, isEnhancing = false } = props;
	const content = useCompute(nodeState, ({ value }) => value.content);

	// =========================================================================
	// Events
	// =========================================================================

	const handleVideoIdChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.videoId = value;
			nodeState._notify({ listenerContext: { source: 'video-id-change' } });
		},
		[nodeState]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		nodeState,
		({ value: node, source }) => {
			const embedVariant = node.content;

			// Sync videoId to URL
			if (source === 'video-id-change') {
				if (embedVariant.videoId.trim().length > 0) {
					nodeState._v.content.url = `https://www.youtube.com/watch?v=${embedVariant.videoId.trim()}`;
					nodeState._notify({ listenerContext: { source: 'video-embed-listener' } });
				}
				return;
			}

			// Sync URL to videoId
			if (source === 'url-change') {
				const videoId = extractYouTubeVideoId(node.content.url);
				if (videoId != null && videoId !== embedVariant.videoId) {
					embedVariant.videoId = videoId;
					nodeState._notify({ listenerContext: { source: 'video-embed-listener' } });
				}
			}
		},
		[nodeState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Variant {isEnhancing && '(enhancing...)'}
				</Text>
			</div>

			{/* Video ID */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Video ID
				</Text>
				<TextField
					id="video-id-field"
					label="Video ID"
					labelHidden
					value={content.videoId}
					onChange={handleVideoIdChange}
					autoComplete="off"
					placeholder="dQw4w9WgXcQ"
					disabled={isEnhancing}
				/>
			</div>
		</div>
	);
};

interface TYoutubeVideoEmbedContentProps {
	nodeState: TNodeState<TLinkNode<TYouTubeVideoEmbedLinkNodeContent>>;
	editor: TPageEditor;
	isEnhancing?: boolean;
}
