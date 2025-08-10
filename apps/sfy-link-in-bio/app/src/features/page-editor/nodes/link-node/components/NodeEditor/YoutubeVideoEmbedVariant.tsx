import { TLinkNode, TYouTubeVideoEmbedVariant } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useCompute, useListener } from 'feature-react/state';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../../lib';
import { extractYouTubeVideoId } from './lib';

export const YoutubeVideoEmbedVariant: React.FC<TYoutubeVideoEmbedVariantProps> = (props) => {
	const { nodeState, isHydrating = false } = props;
	const variant = useCompute(
		nodeState,
		({ value: node }) => node.content.variant as TYouTubeVideoEmbedVariant
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleVideoIdChange = React.useCallback(
		(value: string) => {
			const embedVariant = nodeState._v.content.variant as TYouTubeVideoEmbedVariant;
			embedVariant.videoId = value;
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
			const embedVariant = node.content.variant as TYouTubeVideoEmbedVariant;

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
					Variant {isHydrating && '(enhancing...)'}
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
					value={variant.videoId}
					onChange={handleVideoIdChange}
					autoComplete="off"
					placeholder="dQw4w9WgXcQ"
					disabled={isHydrating}
				/>
			</div>
		</div>
	);
};

interface TYoutubeVideoEmbedVariantProps {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
	isHydrating?: boolean;
}
