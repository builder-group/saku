import { useAppBridge } from '@shopify/app-bridge-react';
import { DropZone, Icon, Select, Text, Thumbnail } from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, DeleteIcon } from '@/components';
import { coreApiClient, fetchClient } from '@/environment';
import { TMediaBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const MediaBlockEditor: React.FC<TBlockEditorComponentProps<TMediaBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	const [file, setFile] = React.useState<File>();
	const [isUploading, setIsUploading] = React.useState(false);
	const formattedFileSize = React.useMemo(() => {
		return `${((file?.size ?? 0) / 1024).toFixed(2)} KB`;
	}, [file]);
	const validFileTypes = ['image/gif', 'image/jpeg', 'image/png'];

	const shopify = useAppBridge();

	// =========================================================================
	// Events
	// =========================================================================

	const handleDropZoneDrop = React.useCallback(
		async (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file == null) {
				return;
			}

			setFile(file);
			setIsUploading(true);

			const idToken = await shopify.idToken();

			// 1. Create staged upload targets
			const createFilesResult = await coreApiClient.post(
				'/v1/shopify/ugc/files',
				{
					files: [
						{
							filename: file.name,
							mimeType: file.type,
							fileSize: file.size,
							contentType: 'IMAGE' as const
						}
					]
				},
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);
			if (createFilesResult.isErr()) {
				console.error('Failed to create upload target:', createFilesResult.error);
				return;
			}

			const createdFile = createFilesResult.value.data.files[0];
			if (createdFile == null || createdFile.uploadTarget == null) {
				console.error('No upload target returned');
				return;
			}

			const { uploadTarget, uploadId } = createdFile;
			const resourceUrl = uploadTarget.resourceUrl;
			if (resourceUrl == null || uploadTarget.url == null) {
				console.error('Missing required upload target properties');
				return;
			}

			// 2. Upload to Google Cloud Storage
			const formData = new FormData();
			uploadTarget.parameters.forEach((param) => {
				formData.append(param.name, param.value);
			});
			formData.append('file', file);

			const uploadResult = await fetchClient.post(uploadTarget.url, formData, {
				parseAs: 'text'
			});
			if (uploadResult.isErr()) {
				console.error('Failed to upload file:', uploadResult.error);
				return;
			}

			// 3. Submit the uploaded file to Shopify
			const submitResult = await coreApiClient.post(
				'/v1/shopify/ugc/files/submit',
				{
					files: [
						{
							uploadId,
							resourceUrl,
							filename: file.name,
							contentType: 'IMAGE' as const
						}
					]
				},
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);
			if (submitResult.isErr()) {
				console.error('Failed to submit file:', submitResult.error);
				return;
			}

			const submittedFile = submitResult.value.data.files[0];
			if (submittedFile == null) {
				console.error('No file data returned');
				return;
			}

			if (submittedFile.status === 'ERROR') {
				console.error('Failed to process file:', submittedFile.error);
				return;
			}

			// 4. Update block state with the file ID
			blockState.set((prev) => ({
				...prev,
				media: {
					...prev.media,
					type: 'image',
					url: resourceUrl
				}
			}));
			console.log('Uploaded and processed file:', submittedFile.id);

			setIsUploading(false);
		},
		[blockState, shopify]
	);

	const handleDeleteFile = React.useCallback(() => {
		setFile(undefined);
		blockState.set((prev) => ({
			...prev,
			media: {
				...prev.media,
				type: 'image',
				url: ''
			}
		}));
	}, [blockState]);

	const handleMediaTypeChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({ ...prev, media: { ...prev.media, type: value as 'image' } }));
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

					{/* Image Upload */}
					{block.media?.type === 'image' && (
						<div className="space-y-1">
							<div>
								<Text as="span" variant="bodySm" tone="subdued">
									Image
								</Text>
							</div>
							<div className="flex w-full items-center">
								<div className="h-10 w-10">
									<DropZone
										allowMultiple={false}
										onDrop={handleDropZoneDrop}
										disabled={isUploading}
									>
										{file != null ? (
											<Thumbnail
												size="small"
												alt={file.name}
												source={
													validFileTypes.includes(file.type)
														? window.URL.createObjectURL(file)
														: NoteIcon
												}
											/>
										) : (
											<DropZone.FileUpload />
										)}
									</DropZone>
								</div>
								{file != null ? (
									<div className="flex w-full items-center justify-between pl-2">
										<div className="flex flex-1 flex-col">
											<Text variant="bodyMd" as="span" truncate>
												{file.name}
											</Text>
											<Text variant="bodySm" as="span" tone="subdued">
												{formattedFileSize}
											</Text>
										</div>
										<button
											className={
												'ml-2 cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500'
											}
											onClick={handleDeleteFile}
											disabled={isUploading}
										>
											<Icon source={DeleteIcon} />
										</button>
									</div>
								) : isUploading ? (
									<div className="flex w-full flex-1 flex-col pl-2">
										<Text variant="bodyMd" as="span">
											Uploading...
										</Text>
									</div>
								) : (
									<div className="flex w-full flex-1 flex-col pl-2">
										<Text variant="bodyMd" as="span">
											No file selected
										</Text>
										<Text variant="bodySm" as="span" tone="subdued">
											{validFileTypes.map((type) => type.replace('image/', '')).join(', ')}
										</Text>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</AccordionSection>
			{/* <AccordionSection title="Style">Coming Soon</AccordionSection> */}
		</>
	);
};
