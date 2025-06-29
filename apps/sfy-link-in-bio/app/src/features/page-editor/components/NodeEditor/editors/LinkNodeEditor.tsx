import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { coreApiClient } from '@/environment';
import { TLinkNode } from '../../../types';
import { SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);
	const shopify = useAppBridge();

	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const { canResetTitle, canResetFavicon } = React.useMemo(() => {
		return {
			canResetTitle:
				node.meta?.title != null &&
				node.fetchedMeta?.title != null &&
				node.meta.title !== node.fetchedMeta.title,
			canResetFavicon:
				node.meta?.faviconUrl != null &&
				node.fetchedMeta?.faviconUrl != null &&
				node.meta.faviconUrl !== node.fetchedMeta.faviconUrl
		};
	}, [node.meta, node.fetchedMeta]);

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
		try {
			const idToken = await shopify.idToken();
			const result = await coreApiClient.get('/v1/url/metadata', {
				queryParams: { url: node.url },
				headers: { Authorization: `Bearer ${idToken}` }
			});

			if (result.isErr()) {
				shopify.toast.show('Failed to fetch URL metadata', {
					duration: 3000,
					action: 'Retry',
					onAction: handleUrlFetch
				});
				return;
			}

			const metadata = result.value.data;
			nodeState.set((prev) => ({
				...prev,
				fetchedMeta: {
					title: metadata.title,
					faviconUrl: metadata.icons?.favicon
				},
				meta: {
					title: metadata.title,
					faviconUrl: metadata.icons?.favicon
				}
			}));
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [node.url, nodeState, shopify]);

	const handleTitleChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({
				...prev,
				meta: { ...prev.meta, title: value }
			}));
		},
		[nodeState]
	);

	const handleTitleReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			meta: { ...prev.meta, title: prev.fetchedMeta?.title }
		}));
	}, [nodeState]);

	const handleFaviconChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				meta: { ...prev.meta, faviconUrl: image.url }
			}));
		},
		[nodeState]
	);

	const handleFaviconReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			meta: { ...prev.meta, faviconUrl: prev.fetchedMeta?.faviconUrl }
		}));
	}, [nodeState]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
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
							value={node.meta?.title ?? ''}
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
								node.meta?.faviconUrl != null
									? {
											url: node.meta.faviconUrl,
											fileName: 'Favicon'
										}
									: undefined
							}
							onChange={handleFaviconChange}
						/>
					</div>
				</div>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true}>
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						<TextStyleField
							label="Padding"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.padding}
							nodeValueSetter={(node, value) => {
								node._v.style.padding = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.padding}
							type="number"
							autoComplete="off"
						/>

						<TextStyleField
							label="Margin"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.margin}
							nodeValueSetter={(node, value) => {
								node._v.style.margin = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.margin}
							type="number"
							autoComplete="off"
						/>
					</div>

					<TextStyleField
						label="Background Color"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.backgroundColor}
						nodeValueSetter={(node, value) => {
							node._v.style.backgroundColor = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.backgroundColor}
						autoComplete="off"
					/>

					<TextStyleField
						label="Font Family"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.fontFamily}
						nodeValueSetter={(node, value) => {
							node._v.style.fontFamily = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.fontFamily}
						autoComplete="off"
					/>

					<div className="grid grid-cols-2 gap-3">
						<TextStyleField
							label="Font Size"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.fontSize}
							nodeValueSetter={(node, value) => {
								node._v.style.fontSize = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.fontSize}
							type="number"
							autoComplete="off"
						/>

						<TextStyleField
							label="Text Color"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.textColor}
							nodeValueSetter={(node, value) => {
								node._v.style.textColor = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.textColor}
							autoComplete="off"
						/>
					</div>

					<SelectStyleField
						label="Text Align"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.textAlign}
						nodeValueSetter={(node, value) => {
							node._v.style.textAlign = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.textAlign}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>

					<TextStyleField
						label="Border Radius"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.borderRadius}
						nodeValueSetter={(node, value) => {
							node._v.style.borderRadius = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.borderRadius}
						type="number"
						autoComplete="off"
					/>

					<ToggleStyleField
						label="Shadow"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.shadow}
						nodeValueSetter={(node, value) => {
							node._v.style.shadow = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.shadow}
						ariaLabel="Enable shadow"
					/>
				</div>
			</AccordionSection>
		</>
	);
};
