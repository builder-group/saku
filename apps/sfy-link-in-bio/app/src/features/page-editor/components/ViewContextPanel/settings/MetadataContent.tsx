import { InlineError, Text, TextField } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { ImageUploadField, type TImageUploadOnChangeImage } from '@/components';
import {
	EditorSiteResolveContext,
	resolvePageNodeWithoutChildren,
	TPageEditor
} from '../../../lib';
import { PanelHeader } from '../../PanelHeader';

export const MetadataContent: React.FC<TMetadataContentProps> = (props) => {
	const { editor } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const { content } = useFeatureState(rootNode);
	const { content: resolvedContent } = useCompute(
		rootNode,
		(node) => resolvePageNodeWithoutChildren(node, { site: new EditorSiteResolveContext(editor) }),
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

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			rootNode._v.content.metadata.title = value;
			rootNode._notify();
		},
		[rootNode]
	);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			rootNode._v.content.metadata.description = value;
			rootNode._notify();
		},
		[rootNode]
	);

	const handleImageChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			const hash = editor.registerImage(image.url, image.fileName);
			if (hash != null) {
				rootNode._v.content.metadata.image = hash;
				rootNode._notify();
			}
		},
		[rootNode, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="flex h-full flex-col">
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
							placeholder={resolvedContent?.metadata?.title}
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
							placeholder={resolvedContent?.metadata?.description}
						/>
					</div>

					{/* Image */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Image
						</Text>
						<ImageUploadField image={image} onChange={handleImageChange} onError={setImageError} />
						{imageError != null && (
							<InlineError message={imageError} fieldID="metadata-image-upload-error" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

interface TMetadataContentProps {
	editor: TPageEditor;
}
