import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { coreApiClient } from '@/environment';
import { TLinkNode } from '../../../types';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);
	const shopify = useAppBridge();

	const { canResetTitle, canResetFavicon, canResetImage } = React.useMemo(() => {
		return {
			canResetTitle: node.customMeta?.title != null && node.customMeta?.title !== node.meta?.title,
			canResetFavicon:
				node.customMeta?.faviconUrl != null &&
				node.customMeta?.faviconUrl !== node.meta?.faviconUrl,
			canResetImage:
				node.customMeta?.imageUrl != null && node.customMeta?.imageUrl !== node.meta?.imageUrl
		};
	}, [node]);
	const { faviconUrl, imageUrl } = React.useMemo(() => {
		return {
			faviconUrl: node.customMeta?.faviconUrl ?? node.meta?.faviconUrl,
			imageUrl: node.customMeta?.imageUrl ?? node.meta?.imageUrl
		};
	}, [node]);

	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({ ...prev, url: value }));
		},
		[nodeState]
	);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		const idToken = await shopify.idToken();

		const result = await coreApiClient.get('/v1/url/metadata', {
			queryParams: {
				url: node.url
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
		nodeState.set((prev) => ({
			...prev,
			meta: {
				title: metadata.title,
				faviconUrl: metadata.icons?.favicon,
				imageUrl: metadata.media?.image
			}
		}));
	}, [node.url, nodeState, shopify]);

	const handleTitleChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					title: value
				}
			}));
		},
		[nodeState]
	);

	const handleTitleReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				title: undefined
			}
		}));
	}, [nodeState]);

	const handleFaviconChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					faviconUrl: image.url
				}
			}));
		},
		[nodeState]
	);

	const handleFaviconReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				faviconUrl: undefined
			}
		}));
	}, [nodeState]);

	const handleImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				customMeta: {
					...prev.customMeta,
					imageUrl: image.url
				}
			}));
		},
		[nodeState]
	);

	const handleImageReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			customMeta: {
				...prev.customMeta,
				imageUrl: undefined
			}
		}));
	}, [nodeState]);

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
							value={node.url}
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
							value={node.customMeta?.title ?? node.meta?.title ?? ''}
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
