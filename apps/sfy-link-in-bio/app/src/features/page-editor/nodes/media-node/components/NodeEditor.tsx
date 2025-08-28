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

			{/* Design Section */}
			<AccordionSection title="Design" collapsibleClassName="p-0 border-b-0">
				<AccordionSection
					title="Card"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<AutoLayoutStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.autoLayout}
						tokenSet={editor.tokensMap.autoLayout}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.appearance}
						tokenSet={editor.tokensMap.appearance}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.fill}
						applyValue={(state, value) => {
							state._v.fill = value;
						}}
						tokenSet={editor.tokensMap.fill}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.stroke}
						applyValue={(state, value) => {
							state._v.stroke = value;
						}}
						tokenSet={editor.tokensMap.stroke}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.shadow}
						applyValue={(state, value) => {
							state._v.shadow = value;
						}}
						tokenSet={editor.tokensMap.shadow}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]}
						editor={editor}
					/>
				</AccordionSection>
			</AccordionSection>
		</>
	);
};

type TMediaType = NonNullable<TMediaNode['content']['media']>['type'];
