import { TSingleMediaNodeContentMixin } from '@repo/editor';
import { InlineError, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';
import { TResolvedMedia } from './types';

export const SingleMediaNodeContentMixinEditor = (
	props: TSingleMediaNodeContentMixinEditorProps
) => {
	const { state, editor, className } = props;

	const content = useFeatureState(state);

	const [selectedMediaType, setSelectedMediaType] = React.useState<TResolvedMedia['type']>(() => {
		return content.media?.type ?? 'image';
	});
	const mediaTypeOptions = React.useMemo(() => [{ label: 'Image', value: 'image' }], []);

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
	const [mediaImageError, setImageError] = React.useState<string | null>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleMediaTypeChange = React.useCallback(
		(value: TResolvedMedia['type']) => {
			setSelectedMediaType(value);

			// Clear existing media when changing type
			state._v.media = undefined;
			state._notify();
		},
		[state]
	);

	const handleMediaImageChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						state._v.media = {
							type: 'image',
							hash,
							altText: event.fileName
						};
						state._notify();
					}
					break;
				}
				case 'Removed': {
					state._v.media = undefined;
					state._notify();
					break;
				}
			}
		},
		[state, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Content
				</Text>
			</div>

			{/* Media Type */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Media type
				</Text>
				<Select
					id="media-type-field"
					label="Media type"
					labelHidden
					options={mediaTypeOptions}
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
	);
};

interface TSingleMediaNodeContentMixinEditorProps {
	state: TState<TSingleMediaNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
