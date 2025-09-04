import { tokenRef, TSingleLinkNodeContent } from '@repo/editor';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState, useListener } from 'feature-react/state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';
import { TNodeEditorContext } from './create-node-editor-context';
import { fetchUrlMetadata } from './lib';

export const SingleContent: React.FC<TSingleContentProps> = (props) => {
	const { cx, className } = props;

	const content = useCompute(cx.node, ({ value }) => value.content, [], { isEqual: false });
	const isEnhancing = useFeatureState(cx.isEnhancing);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);
	const [faviconImageError, setFaviconImageError] = React.useState<string | null>(null);
	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const faviconImage = React.useMemo(() => {
		const asset = cx.editor.getImageAsset(
			content.userFavicon === undefined ? content.favicon : content.userFavicon
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.userFavicon, content.favicon, cx]);

	const titleValue = React.useMemo(() => {
		return content.userTitle ?? content.title;
	}, [content.userTitle, content.title]);
	const descriptionValue = React.useMemo(() => {
		return content.userDescription ?? content.description;
	}, [content.userDescription, content.description]);

	const canResetTitle = React.useMemo(
		() => content.title != null && content.userTitle != null && content.userTitle !== content.title,
		[content.userTitle, content.title]
	);
	const canResetDescription = React.useMemo(
		() =>
			content.description != null &&
			content.userDescription != null &&
			content.userDescription !== content.description,
		[content.userDescription, content.description]
	);
	const canResetFavicon = React.useMemo(
		() =>
			content.favicon !== undefined &&
			content.userFavicon !== undefined &&
			content.userFavicon !== content.favicon,
		[content.userFavicon, content.favicon]
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

	const handleTitleChange = React.useCallback(
		(value: string) => {
			cx.node._v.content.userTitle = value;
			cx.node._notify();
		},
		[cx]
	);

	const handleTitleReset = React.useCallback(() => {
		cx.node._v.content.userTitle = undefined;
		cx.node._notify();
	}, [cx]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			cx.node._v.content.userDescription = value;
			cx.node._notify();
		},
		[cx]
	);

	const handleDescriptionReset = React.useCallback(() => {
		cx.node._v.content.userDescription = undefined;
		cx.node._notify();
	}, [cx]);

	const handleFaviconImageChange = React.useCallback(
		(image: TImageUploadEvent) => {
			switch (image.type) {
				case 'Changed': {
					const hash = cx.editor.registerImage(image.url, image.fileName ?? 'favicon');
					if (hash != null) {
						cx.node._v.content.userFavicon = hash;
						cx.node._v.headingText.typography.textAlignHorizontal = 'start';
						cx.node._v.text.typography.textAlignHorizontal = 'start';
						cx.node._notify();
					}
					break;
				}
				case 'Removed': {
					cx.node._v.content.userFavicon = null;
					cx.node._v.headingText.typography.textAlignHorizontal = tokenRef('heading');
					cx.node._v.text.typography.textAlignHorizontal = tokenRef();
					cx.node._notify();
					break;
				}
			}
		},
		[cx]
	);

	const handleFaviconReset = React.useCallback(() => {
		cx.node._v.content.userFavicon = undefined;
		cx.node._notify();
	}, [cx]);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		try {
			const metadata = await fetchUrlMetadata(content.url, cx.shopify);
			if (metadata == null) {
				cx.shopify.toast.show('Failed to fetch URL metadata', {
					duration: 3000,
					action: 'Retry',
					onAction: handleUrlFetch
				});
				return;
			}

			let faviconHash: string | null = null;
			if (metadata.favicon != null) {
				faviconHash = cx.editor.registerImage(metadata.favicon, 'favicon');
			}

			cx.node._v.content.title = metadata.title;
			cx.node._v.content.description = metadata.description;
			cx.node._v.content.favicon = faviconHash ?? undefined;
			cx.node._notify();
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [cx, content]);

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

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Content {isEnhancing && '(enhancing...)'}
				</Text>
				<Button
					variant="plain"
					size="micro"
					onClick={handleUrlFetch}
					disabled={isFetchingUrlMetadata || isEnhancing}
				>
					{isFetchingUrlMetadata ? 'Fetching metadata...' : 'Fetch metadata'}
				</Button>
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

			{/* Title */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Title
					</Text>
					{canResetTitle && (
						<Button variant="plain" size="micro" onClick={handleTitleReset}>
							Reset
						</Button>
					)}
				</div>
				<TextField
					id="title-field"
					label="Title"
					labelHidden
					value={titleValue}
					onChange={handleTitleChange}
					autoComplete="off"
					placeholder="Link title"
				/>
			</div>

			{/* Description */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Description
					</Text>
					{canResetDescription && (
						<Button variant="plain" size="micro" onClick={handleDescriptionReset}>
							Reset
						</Button>
					)}
				</div>
				<TextField
					id="description-field"
					label="Description"
					labelHidden
					value={descriptionValue}
					onChange={handleDescriptionChange}
					autoComplete="off"
					placeholder="Link description"
				/>
			</div>

			{/* Favicon */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Favicon
					</Text>
					{canResetFavicon && (
						<Button variant="plain" size="micro" onClick={handleFaviconReset}>
							Reset
						</Button>
					)}
				</div>
				<ImageUploadField
					image={faviconImage}
					onChange={handleFaviconImageChange}
					onError={setFaviconImageError}
				/>
				{faviconImageError != null && (
					<InlineError message={faviconImageError} fieldID="favicon-upload-error" />
				)}
			</div>
		</div>
	);
};

interface TSingleContentProps {
	cx: TNodeEditorContext<TSingleLinkNodeContent>;
	className: string;
}
