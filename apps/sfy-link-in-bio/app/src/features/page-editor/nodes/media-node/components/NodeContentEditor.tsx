import { TMediaNode } from '@repo/editor';
import { InlineError, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, JsonPreview, TImageUploadEvent } from '@/components';
import { useNodeProperty } from '../../../hooks';
import { TNodeEditorComponentProps } from '../../../lib';

export const MediaNodeContentEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const [mediaImageError, setImageError] = React.useState<string | null>(null);
	const [selectedMediaType, setSelectedMediaType] = React.useState<TMediaType>(() => {
		return content.type ?? 'image';
	});

	const mediaImage = React.useMemo(() => {
		const asset = editor.getImageAsset(content.media?.hash);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.media, editor]);

	const autoLayoutState = useNodeProperty(nodeState, 'autoLayout');
	const appearanceState = useNodeProperty(nodeState, 'appearance');
	const fillState = useNodeProperty(nodeState, 'fill');
	const strokeState = useNodeProperty(nodeState, 'stroke');
	const shadowState = useNodeProperty(nodeState, 'shadow');
	const imageState = useNodeProperty(nodeState, 'image');

	// =========================================================================
	// Events
	// =========================================================================

	const handleMediaTypeChange = React.useCallback(
		(value: TMediaType) => {
			setSelectedMediaType(value);

			// Clear existing media when changing type
			nodeState._v.content.media = undefined;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleMediaImageChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						nodeState._v.content.media = {
							hash,
							altText: event.fileName
						};
						nodeState._notify();
					}
					break;
				}
				case 'Removed': {
					nodeState._v.content.media = undefined;
					nodeState._notify();
					break;
				}
			}
		},
		[nodeState, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<div className="space-y-4 border-b border-neutral-200 px-4 py-3">
				<div className="space-y-4">
					{/* Media Type */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Media type
						</Text>
						<Select
							id="media-type-field"
							label="Media type"
							labelHidden
							options={[{ label: 'Image', value: 'image' }]}
							value={selectedMediaType}
							onChange={handleMediaTypeChange}
						/>
					</div>

					{/* Image */}
					{selectedMediaType === 'image' && (
						<div className="space-y-1">
							<Text as="span" variant="bodySm" tone="subdued">
								Image
							</Text>
							<ImageUploadField
								image={mediaImage}
								onChange={handleMediaImageChange}
								onError={setImageError}
							/>
							{mediaImageError != null && (
								<InlineError message={mediaImageError} fieldID="media-upload-error" />
							)}
						</div>
					)}
				</div>
			</div>

			{/* Debug Section */}
			{editor.isDebug() && (
				<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
					<div className="space-y-1 px-4">
						<Text as="span" variant="bodySm" tone="subdued">
							JSON
						</Text>
						<JsonPreview data={nodeState._v} />
					</div>
				</AccordionSection>
			)}
		</>
	);
};

type TMediaType = TMediaNode['content']['type'];
