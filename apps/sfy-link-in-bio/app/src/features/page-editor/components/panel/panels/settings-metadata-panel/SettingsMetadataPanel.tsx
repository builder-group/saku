import { InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ImageUploadField, ResizablePanel, TImageUploadEvent } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { EditorSiteResolveContext, TPageEditor } from '../../../../lib';
import { resolvePageMetadata } from '../../../../nodes';
import { PanelHeader } from '../../PanelHeader';

export const SettingsMetadataPanel: React.FC<TSettingsMetadataPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const { resolvedMetadata, metadata } = useCompute(
		rootNode,
		({ value }) => ({
			resolvedMetadata: resolvePageMetadata(value, { site: new EditorSiteResolveContext(editor) }),
			metadata: value.metadata
		}),
		[editor]
	);

	const [imageError, setImageError] = React.useState<string | null>(null);
	const [faviconError, setFaviconError] = React.useState<string | null>(null);

	const image = React.useMemo(() => {
		const asset = editor.getImageAsset(metadata?.image);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [metadata?.image, editor]);

	const favicon = React.useMemo(() => {
		const asset = editor.getImageAsset(metadata?.favicon);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [metadata?.favicon, editor]);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => (pixels / width) * 100;
				return {
					minSize: toPercent(300),
					defaultSize: toPercent(405),
					maxSize: toPercent(525)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined,
				defaultSize: undefined,
				maxSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			rootNode._v.metadata.title = value.length > 0 ? value : undefined;
			rootNode._notify();
		},
		[rootNode]
	);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			rootNode._v.metadata.description = value.length > 0 ? value : undefined;
			rootNode._notify();
		},
		[rootNode]
	);

	const handleImageChange = React.useCallback(
		(image: TImageUploadEvent) => {
			switch (image.type) {
				case 'Changed': {
					const hash = editor.registerImage(image.url, image.fileName);
					if (hash != null) {
						rootNode._v.metadata.image = hash;
						rootNode._notify();
					}
					break;
				}
				case 'Removed': {
					rootNode._v.metadata.image = undefined;
					rootNode._notify();
					break;
				}
			}
		},
		[rootNode, editor]
	);

	const handleFaviconChange = React.useCallback(
		(favicon: TImageUploadEvent) => {
			switch (favicon.type) {
				case 'Changed': {
					const hash = editor.registerImage(favicon.url, favicon.fileName);
					if (hash != null) {
						rootNode._v.metadata.favicon = hash;
						rootNode._notify();
					}
					break;
				}
				case 'Removed': {
					rootNode._v.metadata.favicon = undefined;
					rootNode._notify();
					break;
				}
			}
		},
		[rootNode, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-metadata-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						Metadata
					</Text>
				</PanelHeader>
				<div className="flex-1 overflow-auto">
					<div className="space-y-4 p-4">
						{/* Favicon */}
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Favicon
							</Text>
							<ImageUploadField
								image={favicon}
								onChange={handleFaviconChange}
								onError={setFaviconError}
							/>
							{faviconError != null && (
								<InlineError message={faviconError} fieldID="metadata-favicon-upload-error" />
							)}
						</div>

						{/* Title */}
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Title
							</Text>
							<TextField
								id="title-field"
								label="Title"
								labelHidden
								value={metadata.title}
								onChange={handleTitleChange}
								autoComplete="off"
								placeholder={resolvedMetadata.title}
							/>
						</div>

						{/* Description */}
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Description
							</Text>
							<TextField
								id="description-field"
								label="Description"
								labelHidden
								value={metadata.description}
								onChange={handleDescriptionChange}
								multiline={4}
								autoComplete="off"
								placeholder={resolvedMetadata.description}
							/>
						</div>

						{/* Image */}
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Image
							</Text>
							<ImageUploadField
								image={image}
								onChange={handleImageChange}
								onError={setImageError}
							/>
							{imageError != null && (
								<InlineError message={imageError} fieldID="metadata-image-upload-error" />
							)}
						</div>
					</div>
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsMetadataPanelProps {
	editor: TPageEditor;
	order: number;
}
