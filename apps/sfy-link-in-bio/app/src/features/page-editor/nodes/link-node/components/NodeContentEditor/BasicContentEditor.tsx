import { TLinkNode, tokenRef } from '@repo/editor';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState, useSubscriber } from 'feature-react/state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';
import {
	packTextTokenRef,
	packTypographyTokenRef,
	unpackTextTokenRef,
	unpackTypographyTokenRef
} from '../../../../mixins';
import { fetchUrlMetadata, TNodeEditorContext } from './lib';

export const BasicContentEditor = <
	GBundle extends Extract<TLinkNode, { content: { type: 'basic' } }>
>(
	props: TBasicContentEditorProps<GBundle>
) => {
	const { cx, className } = props;

	const content = useCompute(cx.node, ({ value }) => value.content, [], { isEqual: false });
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);
	const [imageError, setImageError] = React.useState<string | null>(null);
	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const image = React.useMemo(() => {
		const asset = cx.editor.getImageAsset(
			content.userImage === undefined ? content.image : content.userImage
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.userImage, content.image, cx]);

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
	const canResetImage = React.useMemo(
		() =>
			content.image !== undefined &&
			content.userImage !== undefined &&
			content.userImage !== content.image,
		[content.userImage, content.image]
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

	const handleImageChange = React.useCallback(
		(image: TImageUploadEvent) => {
			switch (image.type) {
				case 'Changed': {
					const hash = cx.editor.registerImage(image.url, image.fileName);
					if (hash != null) {
						cx.node._v.content.userImage = hash;

						// Update text alignment
						const unpackedText = unpackTextTokenRef(cx.node._v.text);
						const unpackedTextSm = unpackTextTokenRef(cx.node._v.textSm);
						const unpackedTextTypography = unpackTypographyTokenRef(unpackedText.typography);
						const unpackedTextSmTypography = unpackTypographyTokenRef(unpackedTextSm.typography);
						unpackedTextTypography.textAlignHorizontal = 'start';
						unpackedTextSmTypography.textAlignHorizontal = 'start';
						cx.node._v.text = unpackedText;
						cx.node._v.textSm = unpackedTextSm;

						cx.node._notify();
					}
					break;
				}
				case 'Removed': {
					cx.node._v.content.userImage = null;

					// Update text alignment
					const unpackedText = unpackTextTokenRef(cx.node._v.text);
					const unpackedTextSm = unpackTextTokenRef(cx.node._v.textSm);
					const unpackedTextTypography = unpackTypographyTokenRef(unpackedText.typography);
					const unpackedTextSmTypography = unpackTypographyTokenRef(unpackedTextSm.typography);
					unpackedTextTypography.textAlignHorizontal = tokenRef(
						'text.default',
						'text',
						'typography.textAlignHorizontal'
					);
					unpackedTextSmTypography.textAlignHorizontal = tokenRef(
						'text.sm',
						'text',
						'typography.textAlignHorizontal'
					);
					unpackedText.typography = packTypographyTokenRef(unpackedTextTypography);
					unpackedTextSm.typography = packTypographyTokenRef(unpackedTextSmTypography);
					cx.node._v.text = packTextTokenRef(unpackedText);
					cx.node._v.textSm = packTextTokenRef(unpackedTextSm);

					cx.node._notify();
					break;
				}
			}
		},
		[cx]
	);

	const handleImageReset = React.useCallback(() => {
		cx.node._v.content.userImage = undefined;
		cx.node._notify();
	}, [cx]);

	// TODO: Use enhance functionality?
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

			let imageHash: string | null = null;
			if (metadata.favicon != null) {
				imageHash = cx.editor.registerImage(metadata.favicon, 'favicon');
			}

			cx.node._v.content.title = metadata.title;
			cx.node._v.content.description = metadata.description;
			cx.node._v.content.image = imageHash ?? undefined;
			cx.node._notify();
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [cx, content]);

	// =========================================================================
	// Effects
	// =========================================================================

	useSubscriber(
		cx.node,
		({ value, source }) => {
			if (source !== 'apply-url-and-enhance') {
				setDisplayUrl(value.content.url);
			}
		},
		[cx]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4 py-3', className)}>
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

			{/* Image */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Image
					</Text>
					{canResetImage && (
						<Button variant="plain" size="micro" onClick={handleImageReset}>
							Reset
						</Button>
					)}
				</div>
				<ImageUploadField image={image} onChange={handleImageChange} onError={setImageError} />
				{imageError != null && <InlineError message={imageError} fieldID="image-upload-error" />}
			</div>
		</div>
	);
};

interface TBasicContentEditorProps<
	GBundle extends Extract<TLinkNode, { content: { type: 'basic' } }>
> {
	cx: TNodeEditorContext<GBundle>;
	className: string;
}
