import {
	createYouTubeUrl,
	extractYouTubeId,
	TYouTubeEmbedContentType,
	TYouTubeEmbedLinkNodeContent
} from '@repo/editor';
import { Select, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState, useListener } from 'feature-react/state';
import React from 'react';
import { cn } from '@/lib';
import { TNodeEditorContext } from './create-node-editor-context';

export const YoutubeEmbedContent: React.FC<TYoutubeEmbedContentProps> = (props) => {
	const { cx, className } = props;

	const content = useCompute(cx.node, ({ value }) => value.content, [], { isEqual: false });
	const isEnhancing = useFeatureState(cx.isEnhancing);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);

	const contentTypeLabel = React.useMemo(() => {
		switch (content.contentType) {
			case 'video':
				return 'Video';
			case 'playlist':
				return 'Playlist';
			default:
				return 'Content';
		}
	}, [content.contentType]);
	const contentIdPlaceholder = React.useMemo(() => {
		switch (content.contentType) {
			case 'video':
				return 'dQw4w9WgXcQ';
			case 'playlist':
				return 'PLFzsFUO-y0HAXM8e7CzDHI6fGmLVZjObn';
			default:
				return 'ID';
		}
	}, [content.contentType]);
	const contentTypeOptions = React.useMemo(
		() => [
			{ label: 'Video', value: 'video' },
			{ label: 'Playlist', value: 'playlist' }
		],
		[]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback((value: string) => {
		setDisplayUrl(value);
	}, []);

	const handleUrlBlur = React.useCallback(() => {
		cx.updateUrlAndEnhance(displayUrl).then((result) => {
			if (result.isErr()) {
				cx.shopify.toast.show('Failed to update URL and enhance content', { duration: 3000 });
			}
		});
	}, [cx, displayUrl]);

	const handleContentTypeChange = React.useCallback(
		(value: TYouTubeEmbedContentType) => {
			cx.node._v.content.contentType = value;
			cx.node._notify({ listenerContext: { source: 'content-type-change' } });
		},
		[cx]
	);

	const handleContentIdChange = React.useCallback(
		(value: string) => {
			cx.node._v.content.contentId = value;
			cx.node._notify({ listenerContext: { source: 'content-id-change' } });
		},
		[cx]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		cx.node,
		({ value: node, source }) => {
			if (displayUrl !== node.content.url && source !== 'apply-url-and-enhance') {
				setDisplayUrl(node.content.url);
			}
		},
		[cx, displayUrl]
	);

	useListener(
		cx.node,
		({ value: node, source }) => {
			const embedVariant = node.content;

			switch (source) {
				case 'content-id-change': {
					if (embedVariant.contentId.trim().length > 0) {
						cx.node._v.content.url = createYouTubeUrl(
							embedVariant.contentType,
							embedVariant.contentId.trim()
						);
						cx.node._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					break;
				}
				case 'content-type-change': {
					if (embedVariant.contentId.trim().length > 0) {
						cx.node._v.content.url = createYouTubeUrl(
							embedVariant.contentType,
							embedVariant.contentId.trim()
						);
						cx.node._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					break;
				}
				case 'url-change': {
					const youtubeData = extractYouTubeId(node.content.url);
					if (
						youtubeData != null &&
						(youtubeData.id !== embedVariant.contentId ||
							youtubeData.type !== embedVariant.contentType)
					) {
						embedVariant.contentType = youtubeData.type;
						embedVariant.contentId = youtubeData.id;
						cx.node._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					setDisplayUrl(node.content.url);
					break;
				}
			}
		},
		[cx]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4 py-3', className)}>
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
					value={displayUrl}
					onChange={handleUrlChange}
					onBlur={handleUrlBlur}
					autoComplete="off"
					placeholder="https://example.com"
					type="url"
				/>
			</div>

			{/* Content Type */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Embed Type
				</Text>
				<Select
					label="YouTube Type"
					labelHidden
					options={contentTypeOptions}
					value={content.contentType}
					onChange={handleContentTypeChange}
					disabled={isEnhancing}
				/>
			</div>

			{/* Content ID */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					{contentTypeLabel}
				</Text>
				<TextField
					id="content-id-field"
					label={contentTypeLabel}
					labelHidden
					value={content.contentId}
					onChange={handleContentIdChange}
					autoComplete="off"
					placeholder={contentIdPlaceholder}
					disabled={isEnhancing}
				/>
			</div>
		</div>
	);
};

interface TYoutubeEmbedContentProps {
	cx: TNodeEditorContext<TYouTubeEmbedLinkNodeContent>;
	className: string;
}
