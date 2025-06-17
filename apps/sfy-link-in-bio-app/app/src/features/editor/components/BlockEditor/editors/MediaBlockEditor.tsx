import { useAppBridge } from '@shopify/app-bridge-react';
import { DropZone, Icon, InlineError, Select, Spinner, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, DeleteIcon, ReplaceIcon } from '@/components';
import { listMediaFiles, uploadFiles } from '@/lib';
import { TMediaBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const MediaBlockEditor: React.FC<TBlockEditorComponentProps<TMediaBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);
	const shopify = useAppBridge();

	const [isUploading, setIsUploading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const handleDrop = React.useCallback(
		async (_dropFiles: File[], acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file == null) {
				return;
			}

			setIsUploading(true);
			setError(null);

			const result = await uploadFiles({
				files: [file],
				contentType: 'IMAGE',
				shopify
			});
			if (result.isErr()) {
				setError('Failed to upload image. Please try again.');
				setIsUploading(false);
				return;
			}

			const [uploadedFile] = result.value;
			if (uploadedFile != null) {
				blockState.set((prev: TMediaBlock) => ({
					...prev,
					media: {
						type: 'image',
						url: uploadedFile.resourceUrl,
						fileName: file.name,
						mimeType: file.type
					}
				}));
			}

			setIsUploading(false);
		},
		[blockState, shopify]
	);

	const handleFilePicker = React.useCallback(async () => {
		setError(null);

		const result = await listMediaFiles({
			shopify,
			fileTypes: ['IMAGE'],
			first: 50,
			sortKey: 'UPDATED_AT',
			reverse: true
		});
		if (result.isErr()) {
			setError('Failed to load media files. Please try again.');
			return;
		}

		// Find current file ID based on the URL
		const currentFileId = block.media?.url
			? result.value.files.find((file) => file.url === block.media.url)?.id
			: undefined;

		// Open picker with media files
		const picker = await shopify.picker({
			heading: 'Select an image',
			multiple: false,
			headers: [{ content: 'Preview' }, { content: 'Created' }],
			items: result.value.files.map((file) => {
				const fileName = new URL(file.url).pathname.split('/').pop()?.split('?')[0] ?? '';
				return {
					id: file.id,
					heading: fileName || 'Untitled',
					data: [new Date(file.createdAt).toLocaleDateString()],
					thumbnail: { url: file.url },
					selected: file.id === currentFileId
				};
			})
		});

		const selectedId = (await picker.selected)?.[0];
		if (selectedId != null) {
			const selectedFile = result.value.files.find((f) => f.id === selectedId);
			if (selectedFile != null) {
				blockState.set((prev: TMediaBlock) => ({
					...prev,
					media: {
						type: 'image',
						url: selectedFile.url,
						fileName: new URL(selectedFile.url).pathname.split('/').pop()?.split('?')[0] ?? '',
						width: selectedFile.details.type === 'image' ? selectedFile.details.width : undefined,
						height: selectedFile.details.type === 'image' ? selectedFile.details.height : undefined,
						previewImageUrl: selectedFile.previewImage?.url
					}
				}));
			}
		}
	}, [blockState, shopify, block]);

	const handleRemove = React.useCallback(() => {
		blockState.set((prev) => ({
			...prev,
			media: {
				type: 'image',
				url: ''
			}
		}));
	}, [blockState]);

	const handleMediaTypeChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({ ...prev, media: { type: value as 'image', url: '' } }));
		},
		[blockState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AccordionSection title="Content">
				<div className="space-y-4">
					{/* Media Type */}
					<div className="space-y-1">
						<div className="block">
							<Text as="span" variant="bodySm" tone="subdued">
								Media type
							</Text>
						</div>
						<Select
							id="media-type-field"
							label="Media type"
							labelHidden
							options={[{ label: 'Image', value: 'image' }]}
							value={block.media?.type ?? 'image'}
							onChange={handleMediaTypeChange}
						/>
					</div>

					{/* Image Type */}
					{block.media?.type === 'image' && (
						<div className="space-y-1">
							<div>
								<Text as="span" variant="bodySm" tone={error != null ? 'critical' : 'subdued'}>
									Image
								</Text>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-10 w-10 flex-shrink-0">
									<DropZone onDrop={handleDrop} allowMultiple={false}>
										{isUploading ? (
											<div className="flex h-10 w-10 items-center justify-center">
												<Spinner size="small" />
											</div>
										) : block.media?.url.length > 0 ? (
											<img
												src={block.media.url}
												alt={block.media.altText ?? ''}
												className="h-10 w-10 rounded-lg object-cover"
											/>
										) : (
											<DropZone.FileUpload />
										)}
									</DropZone>
								</div>
								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									{isUploading ? (
										<Text as="span">Uploading...</Text>
									) : block.media?.url.length > 0 ? (
										<Text as="span" truncate>
											{block.media.fileName ?? 'Untitled'}
										</Text>
									) : (
										<>
											<Text as="span">
												Drop files to upload or{' '}
												<button
													type="button"
													onClick={handleFilePicker}
													className="cursor-pointer text-blue-500 hover:text-blue-600"
												>
													browse
												</button>
											</Text>
											<Text as="span" variant="bodySm" tone="subdued">
												Accepts .jpg, .png, and .gif
											</Text>
										</>
									)}
								</div>
								{block.media.url.length > 0 && (
									<div className="flex flex-shrink-0 items-center gap-2">
										<button
											className={'cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200'}
											onClick={handleFilePicker}
											disabled={isUploading}
										>
											<Icon source={ReplaceIcon} />
										</button>
										<button
											className={
												'cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500'
											}
											onClick={handleRemove}
											disabled={isUploading}
										>
											<Icon source={DeleteIcon} />
										</button>
									</div>
								)}
							</div>
							{error != null && (
								<div className="mt-2">
									<InlineError message={error} fieldID="media-upload-error" />
								</div>
							)}
						</div>
					)}
				</div>
			</AccordionSection>
			{/* <AccordionSection title="Style">Coming Soon</AccordionSection> */}
		</>
	);
};
