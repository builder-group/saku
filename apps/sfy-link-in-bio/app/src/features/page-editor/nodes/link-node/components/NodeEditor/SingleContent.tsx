import { TLinkNode, TSingleLinkNodeContent } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { TNodeState, TPageEditor } from '../../../../lib';
import { fetchUrlMetadata } from './lib';

export const SingleContent: React.FC<TSingleContentProps> = (props) => {
	const { nodeState, editor, isEnhancing = false } = props;
	const content = useCompute(nodeState, ({ value }) => value.content);
	const shopify = useAppBridge();

	const [faviconImageError, setFaviconImageError] = React.useState<string | null>(null);
	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const faviconImage = React.useMemo(() => {
		const asset = editor.getImageAsset(
			content.userFavicon === undefined ? content.favicon : content.userFavicon
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.userFavicon, content.favicon, editor]);

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

	const handleTitleChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.userTitle = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleTitleReset = React.useCallback(() => {
		nodeState._v.content.userTitle = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.userDescription = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleDescriptionReset = React.useCallback(() => {
		nodeState._v.content.userDescription = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleFaviconImageChange = React.useCallback(
		(image: TImageUploadEvent) => {
			switch (image.type) {
				case 'Changed': {
					const hash = editor.registerImage(image.url, image.fileName ?? 'favicon');
					if (hash != null) {
						nodeState._v.content.userFavicon = hash;
						nodeState._notify();
					}
					break;
				}
				case 'Removed': {
					nodeState._v.content.userFavicon = null;
					nodeState._notify();
					break;
				}
			}
		},
		[nodeState, editor]
	);

	const handleFaviconReset = React.useCallback(() => {
		nodeState._v.content.userFavicon = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		try {
			const metadata = await fetchUrlMetadata(content.url, shopify);
			if (metadata == null) {
				shopify.toast.show('Failed to fetch URL metadata', {
					duration: 3000,
					action: 'Retry',
					onAction: handleUrlFetch
				});
				return;
			}

			let faviconHash: string | null = null;
			if (metadata.favicon != null) {
				faviconHash = editor.registerImage(metadata.favicon, 'favicon');
			}

			nodeState._v.content.title = metadata.title;
			nodeState._v.content.description = metadata.description;
			nodeState._v.content.favicon = faviconHash ?? undefined;
			nodeState._notify();
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [editor, content, nodeState, shopify]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Variant {isEnhancing && '(enhancing...)'}
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
	nodeState: TNodeState<TLinkNode<TSingleLinkNodeContent>>;
	editor: TPageEditor;
	isEnhancing?: boolean;
}
