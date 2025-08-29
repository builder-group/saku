import { InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { unwrapOrNull } from 'tuple-result';
import { ImageUploadField, ResizablePanel, TImageUploadEvent } from '@/components';
import { EditorSiteResolveContext, TPageEditor } from '../../../../lib';
import { resolvePageNodeWithoutChildren } from '../../../../nodes';
import { PanelHeader } from '../../../PanelHeader';

export const SettingsMetadataPanel: React.FC<TSettingsMetadataPanelProps> = (props) => {
	const { editor, order } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const { content } = useFeatureState(rootNode);
	const resolvedPageNode = useCompute(
		rootNode,
		({ value: node }) =>
			unwrapOrNull(
				resolvePageNodeWithoutChildren(node, { site: new EditorSiteResolveContext(editor) })
			),
		[editor]
	);

	const [imageError, setImageError] = React.useState<string | null>(null);
	const image = React.useMemo(() => {
		const asset = editor.getImageAsset(content.metadata?.image);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.metadata?.image, editor]);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 20,
					defaultSize: 25,
					maxSize: 30
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(300), // ~ 20
				defaultSize: toPercent(375), // ~ 25
				maxSize: toPercent(450) // ~ 30
			};
		},
		[],
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
			rootNode._v.content.metadata.title = value.length > 0 ? value : undefined;
			rootNode._notify();
		},
		[rootNode]
	);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			rootNode._v.content.metadata.description = value.length > 0 ? value : undefined;
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
						rootNode._v.content.metadata.image = hash;
						rootNode._notify();
					}
					break;
				}
				case 'Removed': {
					rootNode._v.content.metadata.image = undefined;
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
						{/* Title */}
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Title
							</Text>
							<TextField
								id="title-field"
								label="Title"
								labelHidden
								value={content.metadata.title}
								onChange={handleTitleChange}
								autoComplete="off"
								placeholder={resolvedPageNode?.content.metadata?.title}
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
								value={content.metadata.description}
								onChange={handleDescriptionChange}
								multiline={4}
								autoComplete="off"
								placeholder={resolvedPageNode?.content.metadata?.description}
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
