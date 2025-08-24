import { TMediaNode } from '@repo/editor';
import { InlineError, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadEvent } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor
} from '../../../mixins';

export const MediaNodeEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	const [mediaImageError, setImageError] = React.useState<string | null>(null);
	const [selectedMediaType, setSelectedMediaType] = React.useState<TMediaType>(() => {
		return content.media?.type ?? 'image';
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
							type: 'image',
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
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
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
			</AccordionSection>

			{/* Card Style Section */}
			<AccordionSection title="Card Style" collapsibleClassName="px-0 space-y-3">
				<AutoLayoutStyleMixinEditor
					state={nodeState}
					parentState={parentNodeState}
					editor={editor}
				/>
				<div className="h-px bg-gray-200" />
				<AppearanceStyleMixinEditor
					state={nodeState}
					parentState={parentNodeState}
					editor={editor}
				/>
				<div className="h-px bg-gray-200" />
				<FillStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<StrokeStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
				<div className="h-px bg-gray-200" />
				<ShadowStyleMixinEditor state={nodeState} parentState={parentNodeState} editor={editor} />
			</AccordionSection>
		</>
	);
};

type TMediaType = NonNullable<TMediaNode['content']['media']>['type'];
