import {
	fontMetadata,
	inheritStyle,
	isInheritedStyle,
	resolveStyleReference,
	TLinkNode
} from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadOnChangeImage } from '@/components';
import { coreApiClient } from '@/environment';
import { ColorStyleField, SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const LinkNodeEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);
	const shopify = useAppBridge();

	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	const [faviconImageError, setFaviconImageError] = React.useState<string | null>(null);
	const faviconImage = React.useMemo(() => {
		const asset = editor.getImageAsset(node.meta?.favicon);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [node.meta?.favicon, editor]);

	const { canResetTitle, canResetFavicon } = React.useMemo(() => {
		return {
			canResetTitle:
				node.meta?.title != null &&
				node.fetchedMeta?.title != null &&
				node.meta.title !== node.fetchedMeta.title,
			canResetFavicon:
				node.meta?.favicon != null &&
				node.fetchedMeta?.favicon != null &&
				node.meta.favicon !== node.fetchedMeta.favicon
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
			const faviconHash = metadata.icons?.favicon
				? (editor.registerImage(metadata.icons.favicon, 'favicon') ?? undefined)
				: undefined;

			nodeState.set((prev) => ({
				...prev,
				fetchedMeta: {
					title: metadata.title,
					favicon: faviconHash
				},
				meta: {
					title: metadata.title,
					favicon: faviconHash
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

	const handleFaviconImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			const hash = editor.registerImage(image.url, image.fileName ?? 'favicon');
			nodeState.set((prev) => ({
				...prev,
				meta: { ...prev.meta, favicon: hash ?? undefined }
			}));
		},
		[nodeState, editor]
	);

	const handleFaviconReset = React.useCallback(() => {
		nodeState.set((prev) => ({
			...prev,
			meta: { ...prev.meta, favicon: prev.fetchedMeta?.favicon }
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
								{isFetchingUrlMetadata ? 'Fetching Metadata...' : 'Fetch Metadata'}
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
							image={faviconImage}
							onChange={handleFaviconImageChange}
							onError={setFaviconImageError}
						/>
						{faviconImageError != null && (
							<InlineError message={faviconImageError} fieldID="favicon-upload-error" />
						)}
					</div>
				</div>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				{/* Layout */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Layout
						</Text>
					</div>
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
					</div>
				</div>

				<div className="h-px bg-gray-200" />

				{/* Typography */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Typography
						</Text>
					</div>
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<SelectStyleField
								label="Font Family"
								node={nodeState}
								parentNode={parentNodeState}
								nodeValueMapper={(value) => resolveStyleReference(value.style.font)?.family}
								nodeValueSetter={(node, value) => {
									if (isInheritedStyle(value)) {
										node._v.style.font = inheritStyle();
										node._notify();
									} else if (value != null) {
										const font = editor.registerFontFamily(value);
										if (font != null) {
											node._v.style.font = font;
											node._notify();
										}
									}
								}}
								parentValueMapper={(parent) =>
									resolveStyleReference(parent.style.children?.font)?.family
								}
								options={fontOptions}
							/>

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
						</div>

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

							<ColorStyleField
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
					</div>
				</div>

				<div className="h-px bg-gray-200" />

				{/* Background & Effects */}
				<div className="space-y-3 px-4">
					<div>
						<Text as="span" variant="headingXs" tone="subdued">
							Background & Effects
						</Text>
					</div>
					<div className="space-y-3">
						<div>
							<ColorStyleField
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
						</div>

						<div>
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
					</div>
				</div>
			</AccordionSection>
		</>
	);
};
