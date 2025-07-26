import { useAppBridge } from '@shopify/app-bridge-react';
import { DropZone, Icon, Spinner, Text } from '@shopify/polaris';
import React from 'react';
import { DeleteIcon, ReplaceIcon } from '@/components';
import { cn, listMediaFiles, uploadFiles } from '@/lib';

export const ImageUploadField: React.FC<TImageUploadFieldProps> = (props) => {
	const { image, onChange, onError } = props;
	const shopify = useAppBridge();

	const [isUploading, setIsUploading] = React.useState(false);
	const [isFetchingMedia, setIsFetchingMedia] = React.useState(false);

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
			onError?.(null);

			const result = await uploadFiles({
				files: [file],
				contentType: 'IMAGE',
				shopify
			});
			if (result.isErr()) {
				onError?.('Failed to upload image. Please try again.');
				setIsUploading(false);
				return;
			}

			const [uploadedFile] = result.value;
			if (uploadedFile != null) {
				onChange?.({
					url: uploadedFile.resourceUrl,
					fileName: file.name
				});
			}

			setIsUploading(false);

			return () => {
				setIsUploading(false);
				onError?.(null);
			};
		},
		[onChange, onError, shopify]
	);

	const handleFilePicker = React.useCallback(async () => {
		onError?.(null);
		setIsFetchingMedia(true);

		const result = await listMediaFiles({
			shopify,
			fileTypes: ['IMAGE'],
			first: 50,
			sortKey: 'UPDATED_AT',
			reverse: true
		});
		if (result.isErr()) {
			onError?.('Failed to load media files. Please try again.');
			setIsFetchingMedia(false);
			return;
		}
		setIsFetchingMedia(false);

		const files = result.value.files;
		const idToIndex = new Map<string, number>();

		// Create items array for the picker
		const items = files.map((file, index) => {
			idToIndex.set(file.id, index);
			return {
				id: file.id,
				heading: file.fileName,
				data: [new Date(file.createdAt).toLocaleDateString()],
				thumbnail: { url: file.url },
				selected: false
			};
		});

		// If we have a current media item add it at the top
		const currentUrl = image?.url;
		if (currentUrl != null && currentUrl.length > 0) {
			items.unshift({
				id: 'current',
				heading: image?.fileName || 'Untitled',
				data: [''],
				thumbnail: { url: currentUrl },
				selected: true
			});
		}

		// Open picker with media files
		const picker = await shopify.picker({
			heading: 'Select an image',
			multiple: false,
			headers: [{ content: 'Preview' }, { content: 'Created' }],
			items
		});

		const selected = await picker.selected;
		const selectedId = selected?.[0];
		if (selectedId != null) {
			// If the selected item is our current item (not in search results), keep using current data
			if (selectedId === 'current') {
				return;
			}

			const selectedFileIndex = idToIndex.get(selectedId);
			const selectedFile = selectedFileIndex != null ? files[selectedFileIndex] : null;
			if (selectedFile != null) {
				onChange?.({
					url: selectedFile.url,
					fileName: selectedFile.fileName,
					width: selectedFile.details.type === 'image' ? selectedFile.details.width : undefined,
					height: selectedFile.details.type === 'image' ? selectedFile.details.height : undefined,
					previewImageUrl: selectedFile.previewImage?.url
				});
			}
		}

		return () => {
			setIsFetchingMedia(false);
			onError?.(null);
		};
	}, [onError, shopify, image, onChange]);

	const handleFileUpload = React.useCallback(async () => {
		// Create a hidden file input
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.style.display = 'none';

		input.onchange = async (event) => {
			const target = event.target as HTMLInputElement;
			const file = target.files?.[0];
			if (file == null) {
				return;
			}

			// Reuse the same logic as handleDrop
			await handleDrop([file], [file]);
		};

		document.body.appendChild(input);
		input.click();
		document.body.removeChild(input);
	}, [handleDrop]);

	const handleRemove = React.useCallback(() => {
		onChange?.({
			url: '',
			fileName: undefined
		});
	}, [onChange]);

	// =========================================================================
	// UI
	// =========================================================================

	const currentUrl = image?.url;
	const hasImage = currentUrl != null && currentUrl.length > 0;

	return (
		<div className="flex items-center gap-2">
			<div className="h-10 w-10 flex-shrink-0">
				<DropZone onDrop={handleDrop} allowMultiple={false}>
					{isUploading ? (
						<div className="flex h-10 w-10 items-center justify-center">
							<Spinner size="small" />
						</div>
					) : hasImage ? (
						<img
							src={currentUrl}
							alt={image?.altText ?? ''}
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
				) : hasImage ? (
					<Text as="span" truncate>
						{image?.fileName ?? 'Untitled'}
					</Text>
				) : (
					<>
						<Text as="span">
							<button
								type="button"
								onClick={handleFileUpload}
								className="cursor-pointer text-[#005bd3] hover:underline"
							>
								Upload
							</button>{' '}
							image or{' '}
							<button
								type="button"
								onClick={handleFilePicker}
								className="cursor-pointer text-[#005bd3] hover:underline"
							>
								browse{isFetchingMedia ? '...' : ''}
							</button>{' '}
							files
						</Text>
						<Text as="span" variant="bodySm" tone="subdued">
							Accepts .jpg, .png, and .gif
						</Text>
					</>
				)}
			</div>
			{hasImage && (
				<div className="flex flex-shrink-0 items-center gap-2">
					<button
						className={cn(
							'cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200',
							(isUploading || isFetchingMedia) && 'cursor-not-allowed opacity-50'
						)}
						onClick={handleFilePicker}
						disabled={isUploading || isFetchingMedia}
					>
						{isFetchingMedia ? <Spinner size="small" /> : <Icon source={ReplaceIcon} />}
					</button>
					<button
						className={cn(
							'cursor-pointer rounded-lg p-0.5 hover:bg-neutral-200 hover:text-red-500',
							isUploading && 'cursor-not-allowed opacity-50'
						)}
						onClick={handleRemove}
						disabled={isUploading}
					>
						<Icon source={DeleteIcon} />
					</button>
				</div>
			)}
		</div>
	);
};

export interface TImageUploadFieldProps {
	image?: {
		url: string;
		fileName?: string;
		altText?: string;
	};
	onChange?: (image: TImageUploadOnChangeImage) => void;
	onError?: (error: string | null) => void;
}

export interface TImageUploadOnChangeImage {
	url: string;
	fileName?: string;
	width?: number;
	height?: number;
	previewImageUrl?: string;
}
