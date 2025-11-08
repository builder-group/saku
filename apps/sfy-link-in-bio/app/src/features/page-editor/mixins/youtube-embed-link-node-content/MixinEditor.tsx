import {
	createYouTubeUrl,
	extractYouTubeId,
	TYouTubeEmbedContentType,
	TYouTubeEmbedLinkNodeContentMixin
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState, useListener } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TResult } from 'tuple-result';
import { AppError, cn } from '@/lib';
import { TPageEditor } from '../../lib';

export const YouTubeEmbedLinkNodeContentMixinEditor = (
	props: TYouTubeEmbedLinkNodeContentMixinEditorProps
) => {
	const { state, cx, className } = props;

	const content = useFeatureState(state);
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);

	const contentTypeLabel = React.useMemo(() => {
		switch (content.contentType) {
			case 'video':
				return 'Video ID';
			case 'playlist':
				return 'Playlist ID';
		}
	}, [content.contentType]);
	const contentIdPlaceholder = React.useMemo(() => {
		switch (content.contentType) {
			case 'video':
				return 'dQw4w9WgXcQ';
			case 'playlist':
				return 'PLFzsFUO-y0HAXM8e7CzDHI6fGmLVZjObn';
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
			state._v.contentType = value;
			state._notify({ listenerContext: { source: 'content-type-change' } });
		},
		[state]
	);

	const handleContentIdChange = React.useCallback(
		(value: string) => {
			state._v.contentId = value;
			state._notify({ listenerContext: { source: 'content-id-change' } });
		},
		[state]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useListener(
		state,
		({ value: content, source }) => {
			if (displayUrl !== content.url && source !== 'apply-url-and-enhance') {
				setDisplayUrl(content.url);
			}
		},
		[cx, displayUrl]
	);

	useListener(
		state,
		({ value: content, source }) => {
			switch (source) {
				case 'content-id-change': {
					if (content.contentId.trim().length > 0) {
						state._v.url = createYouTubeUrl(content.contentType, content.contentId.trim());
						state._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					break;
				}
				case 'content-type-change': {
					if (content.contentId.trim().length > 0) {
						state._v.url = createYouTubeUrl(content.contentType, content.contentId.trim());
						state._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					break;
				}
				case 'url-change': {
					const youtubeData = extractYouTubeId(content.url);
					if (
						youtubeData != null &&
						(youtubeData.id !== content.contentId || youtubeData.type !== content.contentType)
					) {
						state._v.contentType = youtubeData.type;
						state._v.contentId = youtubeData.id;
						state._notify({ listenerContext: { source: 'youtube-embed-listener' } });
					}
					setDisplayUrl(content.url);
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

interface TYouTubeEmbedLinkNodeContentMixinEditorProps {
	state: TState<TYouTubeEmbedLinkNodeContentMixin['value'], any>;
	cx: {
		editor: TPageEditor;
		isEnhancingBundle: TState<boolean, []>;
		shopify: ShopifyGlobal;
		updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
		enhanceBundle: () => Promise<TResult<void, AppError>>;
	};
	className?: string;
}
