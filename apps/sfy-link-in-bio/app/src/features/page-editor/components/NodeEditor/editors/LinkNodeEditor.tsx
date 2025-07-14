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
	const { content } = useFeatureState(nodeState);
	const shopify = useAppBridge();

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const fontOptions = React.useMemo(() => {
		return fontMetadata.map((font) => ({
			label: font.name,
			value: font.font.family
		}));
	}, []);

	const [isFetchingUrlMetadata, setIsFetchingUrlMetadata] = React.useState(false);

	const [faviconImageError, setFaviconImageError] = React.useState<string | null>(null);
	const faviconImage = React.useMemo(() => {
		const asset = editor.getImageAsset(
			content.userMetadata.favicon ?? content.fetchedMetadata?.favicon
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.userMetadata.favicon, content.fetchedMetadata?.favicon, editor]);

	const titleValue = React.useMemo(() => {
		return content.userMetadata.title ?? content.fetchedMetadata?.title;
	}, [content.userMetadata.title, content.fetchedMetadata?.title]);
	const descriptionValue = React.useMemo(() => {
		return content.userMetadata.description ?? content.fetchedMetadata?.description;
	}, [content.userMetadata.description, content.fetchedMetadata?.description]);

	const canResetTitle = React.useMemo(
		() =>
			content.fetchedMetadata?.title != null &&
			content.userMetadata.title != null &&
			content.userMetadata.title !== content.fetchedMetadata.title,
		[content.userMetadata.title, content.fetchedMetadata?.title]
	);
	const canResetDescription = React.useMemo(
		() =>
			content.fetchedMetadata?.description != null &&
			content.userMetadata.description != null &&
			content.userMetadata.description !== content.fetchedMetadata.description,
		[content.userMetadata.description, content.fetchedMetadata?.description]
	);
	const canResetFavicon = React.useMemo(
		() =>
			content.fetchedMetadata?.favicon != null &&
			content.userMetadata.favicon != null &&
			content.userMetadata.favicon !== content.fetchedMetadata.favicon,
		[content.userMetadata.favicon, content.fetchedMetadata?.favicon]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.url = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleUrlFetch = React.useCallback(async () => {
		setIsFetchingUrlMetadata(true);
		try {
			const idToken = await shopify.idToken();
			const result = await coreApiClient.get('/v1/url/metadata', {
				queryParams: { url: content.url },
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

			const urlMetadata = result.value.data;
			const faviconHash =
				urlMetadata.icons?.favicon != null
					? (editor.registerImage(urlMetadata.icons.favicon, 'favicon') ?? undefined)
					: undefined;

			nodeState._v.content.fetchedMetadata = {
				title: urlMetadata.title,
				description: urlMetadata.description,
				favicon: faviconHash
			};
			nodeState._notify();
		} finally {
			setIsFetchingUrlMetadata(false);
		}
	}, [editor, content.url, nodeState, shopify]);

	const handleTitleChange = React.useCallback(
		(value: string) => {
			if (!value.length) {
				nodeState._v.content.userMetadata.title = undefined;
			} else {
				nodeState._v.content.userMetadata.title = value;
			}
			nodeState._notify();
		},
		[nodeState]
	);

	const handleTitleReset = React.useCallback(() => {
		nodeState._v.content.userMetadata.title = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			if (!value.length) {
				nodeState._v.content.userMetadata.description = undefined;
			} else {
				nodeState._v.content.userMetadata.description = value;
			}
			nodeState._notify();
		},
		[nodeState]
	);

	const handleDescriptionReset = React.useCallback(() => {
		nodeState._v.content.userMetadata.description = undefined;
		nodeState._notify();
	}, [nodeState]);

	const handleFaviconImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			const hash = editor.registerImage(image.url, image.fileName ?? 'favicon');
			nodeState._v.content.userMetadata.favicon = hash ?? undefined;
			nodeState._notify();
		},
		[nodeState, editor]
	);

	const handleFaviconReset = React.useCallback(() => {
		nodeState._v.content.userMetadata.favicon = undefined;
		nodeState._notify();
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
							value={content.url}
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
							min={0}
							max={100}
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
							min={0}
							max={999}
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
								nodeValueMapper={(value) =>
									isInheritedStyle(value.style.font)
										? { type: 'inherit' }
										: resolveStyleReference(value.style.font)?.family
								}
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
								parentValueMapper={(parent) => parent.style.children.font.family}
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
								min={0}
								max={96}
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
