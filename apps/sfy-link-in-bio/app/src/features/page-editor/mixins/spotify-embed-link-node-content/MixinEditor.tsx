import {
	createSpotifyUrl,
	extractSpotifyId,
	TSpotifyEmbedContentType,
	TSpotifyEmbedLinkNodeContentMixin
} from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Select, Text, TextField } from '@shopify/polaris';
import { useFeatureState, useListener } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TResult } from 'tuple-result';
import { AppError, cn } from '@/lib';

export const SpotifyEmbedLinkNodeContentMixinEditor = (
	props: TSpotifyEmbedLinkNodeContentMixinEditorProps
) => {
	const { state, cx, className } = props;

	const content = useFeatureState(state);
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);

	const contentTypeLabel = React.useMemo(() => {
		switch (content.contentType) {
			case 'track':
				return 'Track ID';
			case 'album':
				return 'Album ID';
			case 'playlist':
				return 'Playlist ID';
			case 'artist':
				return 'Artist ID';
		}
	}, [content.contentType]);
	const contentIdPlaceholder = React.useMemo(() => {
		switch (content.contentType) {
			case 'track':
				return '6HhvbFrtFZ43d6qJCiZ7YX';
			case 'album':
				return '0D6MiyCCYPgyEeLKMU5PAM';
			case 'playlist':
				return '37i9dQZF1E36XFretM2CHY';
			case 'artist':
				return '2Aq0ejE2gV9qe4lvGeNQQC';
		}
	}, [content.contentType]);
	const contentTypeOptions = React.useMemo(
		() => [
			{ label: 'Track', value: 'track' },
			{ label: 'Album', value: 'album' },
			{ label: 'Playlist', value: 'playlist' },
			{ label: 'Artist', value: 'artist' }
		],
		[]
	);
	const heightOptions = React.useMemo(
		() => [
			{ label: 'Normal', value: '352' },
			{ label: 'Compact', value: '152' }
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
		(value: TSpotifyEmbedContentType) => {
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

	const handleHeightChange = React.useCallback(
		(value: string) => {
			state._v.height = parseInt(value, 10);
			state._notify({ listenerContext: { source: 'height-change' } });
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
						state._v.url = createSpotifyUrl(content.contentType, content.contentId.trim());
						state._notify({ listenerContext: { source: 'spotify-embed-listener' } });
					}
					break;
				}
				case 'content-type-change': {
					if (content.contentId.trim().length > 0) {
						state._v.url = createSpotifyUrl(content.contentType, content.contentId.trim());
						state._notify({ listenerContext: { source: 'spotify-embed-listener' } });
					}
					break;
				}
				case 'url-change': {
					const spotifyData = extractSpotifyId(content.url);
					if (
						spotifyData != null &&
						(spotifyData.id !== content.contentId || spotifyData.type !== content.contentType)
					) {
						state._v.contentType = spotifyData.type;
						state._v.contentId = spotifyData.id;
						state._notify({ listenerContext: { source: 'spotify-embed-listener' } });
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
					label="Spotify Type"
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

			{/* Height */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Height
				</Text>
				<Select
					label="Height"
					labelHidden
					options={heightOptions}
					value={content.height.toString()}
					onChange={handleHeightChange}
					disabled={isEnhancing}
				/>
			</div>
		</div>
	);
};

interface TSpotifyEmbedLinkNodeContentMixinEditorProps {
	state: TState<TSpotifyEmbedLinkNodeContentMixin['value'], any>;
	cx: {
		isEnhancingBundle: TState<boolean, []>;
		shopify: ShopifyGlobal;
		updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
		enhanceBundle: () => Promise<TResult<void, AppError>>;
	};
	className?: string;
}
