import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { coreApiClient } from '@/environment';
import { TLinkBlock } from '../../../types';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const LinkBlockEditor: React.FC<TBlockEditorComponentProps<TLinkBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);
	const shopify = useAppBridge();

	const { canResetTitle, canResetFavicon, canResetImage } = React.useMemo(() => {
		return {
			canResetTitle:
				block.customMeta?.title != null && block.customMeta?.title !== block.meta?.title,
			canResetFavicon:
				block.customMeta?.faviconUrl != null &&
				block.customMeta?.faviconUrl !== block.meta?.faviconUrl,
			canResetImage:
				block.customMeta?.imageUrl != null && block.customMeta?.imageUrl !== block.meta?.imageUrl
		};
	}, [block]);
	const { faviconUrl, imageUrl } = React.useMemo(() => {
		return {
			faviconUrl: block.customMeta?.faviconUrl ?? block.meta?.faviconUrl,
			imageUrl: block.customMeta?.imageUrl ?? block.meta?.imageUrl
		};
	}, [block]);

	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({ ...prev, url: value }));
		},
		[blockState]
	);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		const idToken = await shopify.idToken();

		const result = await coreApiClient.get('/v1/url/metadata', {
			queryParams: {
				url: block.url
			},
			headers: {
				Authorization: `Bearer ${idToken}`
			}
		});
		if (result.isErr()) {
			shopify.toast.show('Failed to fetch URL metadata', {
				duration: 3000,
				action: 'Retry',
				onAction: handleUrlFetch
			});
			setIsFetchingUrlMetadata(false);
			return;
		}
		setIsFetchingUrlMetadata(false);

		const metadata = result.value.data;
		blockState.set((prev) => ({
			...prev,
			meta: {
				title: metadata.title,
				faviconUrl: metadata.icons?.favicon,
				imageUrl: metadata.media?.image
			}
		}));
	}, [block.url, blockState, shopify]);

	const handleTitleChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					title: value
				}
			}));
		},
		[blockState]
	);

	const handleTitleReset = React.useCallback(() => {
		blockState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				title: undefined
			}
		}));
	}, [blockState]);

	const handleFaviconChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			blockState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					faviconUrl: image.url
				}
			}));
		},
		[blockState]
	);

	const handleFaviconReset = React.useCallback(() => {
		blockState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				faviconUrl: undefined
			}
		}));
	}, [blockState]);

	const handleImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			blockState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					imageUrl: image.url
				}
			}));
		},
		[blockState]
	);

	const handleImageReset = React.useCallback(() => {
		blockState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				imageUrl: undefined
			}
		}));
	}, [blockState]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AccordionSection title="Content">
				<div className="space-y-4">
					{/* URL */}
					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<Text as="span" variant="bodySm" tone="subdued">
								URL
							</Text>
							<Button
								variant="plain"
								size="micro"
								onClick={handleUrlFetch}
								disabled={isFetchingUrlMetadata}
							>
								{isFetchingUrlMetadata ? 'Fetching...' : 'Fetch'}
							</Button>
						</div>
						<TextField
							id="url-field"
							label="URL"
							labelHidden
							value={block.url}
							onChange={handleUrlChange}
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
							value={block.customMeta?.title ?? block.meta?.title ?? ''}
							onChange={handleTitleChange}
							autoComplete="off"
							placeholder="Link title"
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
							image={
								faviconUrl != null
									? {
											url: faviconUrl,
											fileName: 'Favicon'
										}
									: undefined
							}
							onChange={handleFaviconChange}
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
						<ImageUploadField
							image={
								imageUrl != null
									? {
											url: imageUrl,
											fileName: 'Image'
										}
									: undefined
							}
							onChange={handleImageChange}
						/>
					</div>
				</div>
			</AccordionSection>
		</>
	);
};
