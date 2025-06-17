import { Err, Ok, type TResult } from '@blgc/utils';
import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { coreApiClient, fetchClient } from '@/environment';
import type { TError } from '@/types';

export async function uploadFiles(
	config: TUploadFilesConfig
): Promise<TResult<TUploadFilesSuccess, TError>> {
	const { files, contentType, shopify } = config;
	const idToken = await shopify.idToken();

	// 1. Create staged upload targets
	const createFilesResult = await coreApiClient.post(
		'/v1/shopify/ugc/files',
		{
			files: files.map((file) => ({
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				contentType
			}))
		},
		{
			headers: {
				Authorization: `Bearer ${idToken}`
			}
		}
	);

	if (createFilesResult.isErr()) {
		return Err({
			code: '#ERR_CREATE_UPLOAD_TARGET',
			message: `Failed to create upload targets: ${createFilesResult.error.message}`
		});
	}

	const createdFiles = createFilesResult.value.data.files;
	if (!createdFiles?.length || createdFiles.length !== files.length) {
		return Err({
			code: '#ERR_NO_UPLOAD_TARGET',
			message: 'No upload targets returned or mismatch in number of files'
		});
	}

	// 2. Upload all files to Google Cloud Storage
	const uploadPromises = createdFiles.map(async (createdFile, index) => {
		if (createdFile?.uploadTarget == null) {
			throw new Error('Missing upload target');
		}

		const { uploadTarget, uploadId } = createdFile;
		const resourceUrl = uploadTarget.resourceUrl;
		if (resourceUrl == null || uploadTarget.url == null) {
			throw new Error('Missing required upload target properties');
		}

		const formData = new FormData();
		uploadTarget.parameters.forEach((param) => {
			formData.append(param.name, param.value);
		});

		const file = files[index];
		if (!file) {
			throw new Error('File not found at index ' + index);
		}
		formData.append('file', file);

		const uploadResult = await fetchClient.post(uploadTarget.url, formData, {
			parseAs: 'text'
		});

		if (uploadResult.isErr()) {
			throw new Error(`Failed to upload file: ${uploadResult.error.message}`);
		}

		return {
			uploadId,
			resourceUrl,
			filename: file.name
		};
	});

	let uploadedFiles;
	try {
		uploadedFiles = await Promise.all(uploadPromises);
	} catch (error) {
		return Err({
			code: '#ERR_UPLOAD_FILE',
			message: error instanceof Error ? error.message : 'Failed to upload files'
		});
	}

	// 3. Submit all uploaded files to Shopify
	const submitResult = await coreApiClient.post(
		'/v1/shopify/ugc/files/submit',
		{
			files: uploadedFiles.map((file) => ({
				...file,
				contentType
			}))
		},
		{
			headers: {
				Authorization: `Bearer ${idToken}`
			}
		}
	);

	if (submitResult.isErr()) {
		return Err({
			code: '#ERR_SUBMIT_FILE',
			message: `Failed to submit files: ${submitResult.error.message}`
		});
	}

	const submittedFiles = submitResult.value.data.files;
	if (!submittedFiles?.length) {
		return Err({
			code: '#ERR_NO_FILE_DATA',
			message: 'No file data returned'
		});
	}

	// Check if any files failed to process
	const failedFiles = submittedFiles.filter((file) => file.status === 'ERROR');
	if (failedFiles.length > 0) {
		return Err({
			code: '#ERR_PROCESS_FILE',
			message:
				failedFiles
					.map((file) => file.error)
					.filter(Boolean)
					.join(', ') || 'Failed to process files'
		});
	}

	// Return all successfully processed files
	return Ok(
		submittedFiles
			.filter(
				(file): file is { status: 'SUCCESS'; id: string; uploadId: string } =>
					file.status === 'SUCCESS' && 'id' in file
			)
			.map((file) => ({
				id: file.id,
				resourceUrl: uploadedFiles.find((u) => u.uploadId === file.uploadId)?.resourceUrl ?? ''
			}))
	);
}

export interface TUploadFilesConfig {
	files: File[];
	contentType: 'IMAGE' | 'VIDEO' | 'FILE';
	shopify: ShopifyGlobal;
}

export type TUploadFilesSuccess = {
	id: string;
	resourceUrl: string;
}[];
