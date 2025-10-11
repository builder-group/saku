import {
	createSpotifyUrl,
	extractSpotifyId,
	TSpotifyEmbedContentType,
	TSpotifyEmbedLinkNodeBundle
} from '@repo/editor';
import { Select, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState, useListener } from 'feature-react/state';
import React from 'react';
import { cn } from '@/lib';
import { TNodeEditorContext } from './lib';

export const SpotifyEmbedContent: React.FC<TSpotifyEmbedContentProps> = (props) => {
	const { cx, className } = props;

	const content = useCompute(cx.node, ({ value }) => value.content, [], { isEqual: false });
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);
	const contentTypeLabel = React.useMemo(() => {
		switch (content.contentType) {
			case 'track':
				return 'Track';
			case 'album':
				return 'Album';
			case 'playlist':
				return 'Playlist';
			case 'artist':
				return 'Artist';
			default:
				return 'Content';
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
			default:
				return 'ID';
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

	const handleHeightChange = React.useCallback(
		(value: string) => {
			cx.node._v.content.height = parseInt(value, 10);
			cx.node._notify({ listenerContext: { source: 'height-change' } });
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
						cx.node._v.content.url = createSpotifyUrl(
							embedVariant.contentType,
							embedVariant.contentId.trim()
						);
						cx.node._notify({ listenerContext: { source: 'spotify-embed-listener' } });
					}
					break;
				}
				case 'content-type-change': {
					if (embedVariant.contentId.trim().length > 0) {
						cx.node._v.content.url = createSpotifyUrl(
							embedVariant.contentType,
							embedVariant.contentId.trim()
						);
						cx.node._notify({ listenerContext: { source: 'spotify-embed-listener' } });
					}
					break;
				}
				case 'url-change': {
					const spotifyData = extractSpotifyId(node.content.url);
					if (
						spotifyData != null &&
						(spotifyData.id !== embedVariant.contentId ||
							spotifyData.type !== embedVariant.contentType)
					) {
						embedVariant.contentType = spotifyData.type;
						embedVariant.contentId = spotifyData.id;
						cx.node._notify({ listenerContext: { source: 'spotify-embed-listener' } });
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
					{contentTypeLabel} ID
				</Text>
				<TextField
					id="content-id-field"
					label={`${contentTypeLabel} ID`}
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
					Height (px)
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

interface TSpotifyEmbedContentProps {
	cx: TNodeEditorContext<TSpotifyEmbedLinkNodeBundle>;
	className: string;
}
