import { TDefaultLinkVariant, TLinkNode } from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { TNodeState, TPageEditor } from '../../../../lib';
import { fetchUrlMetadata } from './lib';

export const DefaultLinkVariant: React.FC<TDefaultLinkVariantProps> = (props) => {
	const { nodeState, editor, isEnhancing = false } = props;
	const { url, variant } = useCompute(nodeState, ({ value: node }) => ({
		url: node.content.url,
		variant: node.content.variant as TDefaultLinkVariant
	}));
	const shopify = useAppBridge();

	const [faviconImageError, setFaviconImageError] = React.useState<string | null>(null);
	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const faviconImage = React.useMemo(() => {
		const asset = editor.getImageAsset(variant.userFavicon ?? variant.favicon);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [variant.userFavicon, variant.favicon, editor]);

	const titleValue = React.useMemo(() => {
		return variant.userTitle ?? variant.title;
	}, [variant.userTitle, variant.title]);

	const descriptionValue = React.useMemo(() => {
		return variant.userDescription ?? variant.description;
	}, [variant.userDescription, variant.description]);

	const canResetTitle = React.useMemo(
		() => variant.title != null && variant.userTitle != null && variant.userTitle !== variant.title,
		[variant.userTitle, variant.title]
	);

	const canResetDescription = React.useMemo(
		() =>
			variant.description != null &&
			variant.userDescription != null &&
			variant.userDescription !== variant.description,
		[variant.userDescription, variant.description]
	);

	const canResetFavicon = React.useMemo(
		() =>
			variant.favicon != null &&
			variant.userFavicon != null &&
			variant.userFavicon !== variant.favicon,
		[variant.userFavicon, variant.favicon]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
			defaultVariant.userTitle = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleTitleReset = React.useCallback(() => {
		const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
		defaultVariant.userTitle = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
			defaultVariant.userDescription = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleDescriptionReset = React.useCallback(() => {
		const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
		defaultVariant.userDescription = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleFaviconImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			const hash = editor.registerImage(image.url, image.fileName ?? 'favicon');
			const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
			defaultVariant.userFavicon = hash ?? undefined;
			nodeState._notify();
		},
		[nodeState, editor]
	);

	const handleFaviconReset = React.useCallback(() => {
		const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
		defaultVariant.userFavicon = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		try {
			const metadata = await fetchUrlMetadata(url, shopify);
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

			const defaultVariant = nodeState._v.content.variant as TDefaultLinkVariant;
			defaultVariant.title = metadata.title;
			defaultVariant.description = metadata.description;
			defaultVariant.favicon = faviconHash ?? undefined;
			nodeState._notify();
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [editor, url, nodeState, shopify]);

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

interface TDefaultLinkVariantProps {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
	isEnhancing?: boolean;
}
