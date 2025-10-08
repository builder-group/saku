import type { ShopifyGlobal } from '@shopify/app-bridge-types';
import { Err, Ok, type TResult } from 'tuple-result';
import { coreApiClient, fetchClient } from '@/environment';
import type { TError } from '@/types';
import { createShopifyTokenMiddleware } from './middleware';

export async function uploadFiles(
	config: TUploadFilesConfig
): Promise<TResult<TUploadFilesSuccess, TError>> {
	const { files, contentType, shopify } = config;
	const idToken = await shopify.idToken();

	if (!files.length) {
		return Ok([]);
	}

	// Create staged upload targets
	const [isCreateUploadTargetsOk, createUploadTargetsErr, createUploadTargetsResponse] =
		await coreApiClient.post(
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
				requestMiddlewares: [createShopifyTokenMiddleware(idToken)]
			}
		);
	if (!isCreateUploadTargetsOk) {
		return Err({
			code: '#ERR_CREATE_UPLOAD_TARGETS',
			message: `Failed to create staged upload targets: ${createUploadTargetsErr.message}`
		});
	}

	const uploadTargets = createUploadTargetsResponse.data.files;
	if (uploadTargets.length !== files.length) {
		return Err({
			code: '#ERR_CREATE_UPLOAD_TARGETS_MISMATCH',
			message: 'Failed to create all staged upload targets'
		});
	}

	// Upload each asset to its staged target
	const uploadPromises = uploadTargets.map(async ({ uploadTarget, uploadId }, index) => {
		const file = files[index];
		if (file == null) {
			throw new Error('Missing file');
		}

		const formData = new FormData();
		uploadTarget.parameters.forEach((param) => {
			formData.append(param.name, param.value);
		});
		formData.append('file', file);

		const [isUploadOk, uploadErr] = await fetchClient.post(uploadTarget.url, formData, {
			parseAs: 'text'
		});
		if (!isUploadOk) {
			throw new Error(`Failed to upload file: ${uploadErr.message}`);
		}

		return {
			uploadId,
			file,
			target: uploadTarget
		};
	});

	let uploadedFiles;
	try {
		uploadedFiles = await Promise.all(uploadPromises);
	} catch (error) {
		return Err({
			code: '#ERR_UPLOAD_FILES',
			message:
				error instanceof Error ? error.message : 'Failed to upload files to staged upload targets'
		});
	}

	// Submit all uploaded files to Shopify
	const [isSubmitFilesOk, submitFilesErr, submitFilesResponse] = await coreApiClient.post(
		'/v1/shopify/ugc/files/submit',
		{
			files: uploadedFiles.map((uploadedFile) => ({
				uploadId: uploadedFile.uploadId,
				filename: uploadedFile.file.name,
				resourceUrl: uploadedFile.target.resourceUrl,
				contentType
			}))
		},
		{
			requestMiddlewares: [createShopifyTokenMiddleware(idToken)]
		}
	);
	if (!isSubmitFilesOk) {
		return Err({
			code: '#ERR_SUBMIT_FILES',
			message: `Failed to submit files: ${submitFilesErr.message}`
		});
	}

	const submittedFiles = submitFilesResponse.data.files;
	if (submittedFiles.length !== uploadedFiles.length) {
		return Err({
			code: '#ERR_SUBMIT_FILES_MISMATCH',
			message: 'Failed to submit all files'
		});
	}

	return Ok(
		submittedFiles.map((file, index) => {
			const uploadedFile = uploadedFiles[index] as {
				target: { resourceUrl: string };
			};
			return {
				id: file.id,
				resourceUrl: uploadedFile.target.resourceUrl
			};
		})
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
