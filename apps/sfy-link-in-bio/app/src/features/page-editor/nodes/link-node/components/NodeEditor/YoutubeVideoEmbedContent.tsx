import { TYouTubeVideoEmbedLinkNodeContent } from '@repo/editor';
import { Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState, useListener } from 'feature-react/state';
import React from 'react';
import { cn } from '@/lib';
import { TNodeEditorContext } from './create-node-editor-context';
import { extractYouTubeVideoId } from './lib';

export const YoutubeVideoEmbedContent: React.FC<TYoutubeVideoEmbedContentProps> = (props) => {
	const { cx, className } = props;
	const content = useCompute(cx.node, ({ value }) => value.content);
	const isEnhancing = useFeatureState(cx.isEnhancing);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback(
		(value: string) => {
			cx.updateUrl(value);
		},
		[cx]
	);

	const handleUrlBlur = React.useCallback(() => {
		cx.validateAndEnhanceContent().then((result) => {
			if (result.isErr()) {
				cx.shopify.toast.show('Failed to validate and enhance content', { duration: 3000 });
			}
		});
	}, [cx]);

	const handleVideoIdChange = React.useCallback(
		(value: string) => {
			cx.node._v.content.videoId = value;
			cx.node._notify({ listenerContext: { source: 'video-id-change' } });
		},
		[cx]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		cx.node,
		({ value: node, source }) => {
			const embedVariant = node.content;

			// Sync videoId to URL
			if (source === 'video-id-change') {
				if (embedVariant.videoId.trim().length > 0) {
					cx.node._v.content.url = `https://www.youtube.com/watch?v=${embedVariant.videoId.trim()}`;
					cx.node._notify({ listenerContext: { source: 'video-embed-listener' } });
				}
				return;
			}

			// Sync URL to videoId
			if (source === 'url-change') {
				const videoId = extractYouTubeVideoId(node.content.url);
				if (videoId != null && videoId !== embedVariant.videoId) {
					embedVariant.videoId = videoId;
					cx.node._notify({ listenerContext: { source: 'video-embed-listener' } });
				}
			}
		},
		[cx]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Content {isEnhancing && '(enhancing...)'}
				</Text>
			</div>

			{/* URL */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					URL
				</Text>
				<TextField
					id="url-field"
					label="URL"
					labelHidden
					value={content.url}
					onChange={handleUrlChange}
					onBlur={handleUrlBlur}
					autoComplete="off"
					placeholder="https://example.com"
					type="url"
				/>
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
	cx: TNodeEditorContext<TYouTubeVideoEmbedLinkNodeContent>;
	className: string;
}
