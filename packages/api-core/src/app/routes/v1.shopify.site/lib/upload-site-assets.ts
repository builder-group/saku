import { getAssetBinary, TAsset, TImageAsset } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { fetchClient } from '@/environment';
import {
	createFiles,
	createStagedUploads,
	mapMimeTypeToResource,
	TStagedUploadsCreateSuccess
} from '@/lib';

export async function uploadSiteAssets(
	assets: TAsset[],
	config: TUploadSiteAssetsConfig
): Promise<TResult<TUploadedAsset[], AppError>> {
	const { shopId, accessToken } = config;

	if (!assets.length) {
		return Ok([]);
	}

	// Create staged upload targets
	const [isCreateStagedUploadsOk, createStagedUploadsErr, uploadTargets] =
		await createStagedUploads(
			assets.map((asset) => ({
				filename: asset.fileName ?? `asset-${asset.hash}`,
				mimeType: asset.contentType,
				resource: mapMimeTypeToResource(asset.contentType),
				fileSize: asset.size?.toString()
			})),
			{ shopId, accessToken }
		);
	if (!isCreateStagedUploadsOk) {
		return Err(createStagedUploadsErr);
	}

	if (uploadTargets.length !== assets.length) {
		return Err(
			new AppError('#ERR_CREATE_UPLOAD_TARGETS_MISMATCH', 500, {
				detail: 'Failed to create all staged upload targets'
			})
		);
	}

	// Upload each asset to its staged target
	const uploadPromises = uploadTargets.map(async (uploadTarget, index) => {
		const asset = assets[index];
		if (asset == null) {
			throw new Error('Missing asset');
		}

		const assetBinary = await getAssetBinary(asset);
		if (assetBinary == null) {
			throw new Error(`Could not retrieve binary for asset '${asset.hash}'`);
		}

		const formData = new FormData();
		uploadTarget.parameters.forEach((param) => {
			formData.append(param.name, param.value);
		});
		formData.append('file', new Blob([assetBinary]));

		const [isUploadOk, uploadErr] = await fetchClient.post(uploadTarget.url, formData, {
			parseAs: 'text'
		});
		if (!isUploadOk) {
			throw new Error(`Failed to upload file: ${uploadErr.message}`);
		}

		return {
			asset,
			target: uploadTarget
		};
	});

	let uploadedFiles;
	try {
		uploadedFiles = await Promise.all(uploadPromises);
	} catch (error) {
		return Err(
			new AppError('#ERR_UPLOAD_FILES', 500, {
				detail:
					error instanceof Error ? error.message : 'Failed to upload files to staged upload targets'
			})
		);
	}

	// Submit all uploaded files to Shopify
	const [isCreateFilesOk, createFilesErr, submittedFiles] = await createFiles(
		uploadedFiles.map((uploadedFile) => {
			const { asset, target } = uploadedFile;
			return {
				filename: asset.fileName ?? `asset-${asset.hash}`,
				alt:
					asset.type === 'image'
						? ((asset as TImageAsset).altText ?? asset.fileName ?? `Asset ${asset.hash}`)
						: (asset.fileName ?? `Asset ${asset.hash}`),
				contentType: mapMimeTypeToResource(asset.contentType),
				originalSource: target.resourceUrl
			};
		}),
		{ shopId, accessToken }
	);
	if (!isCreateFilesOk) {
		return Err(createFilesErr);
	}

	if (submittedFiles.length !== uploadedFiles.length) {
		return Err(
			new AppError('#ERR_SUBMIT_FILES_MISMATCH', 500, {
				detail: 'Failed to submit all files'
			})
		);
	}

	return Ok(
		submittedFiles.map((file, index) => {
			const uploadedFile = uploadedFiles[index] as {
				asset: TAsset;
				target: TStagedUploadsCreateSuccess[number];
			};
			return {
				id: file.id,
				url: file.url ?? uploadedFile.target.resourceUrl,
				originalHash: uploadedFile.asset.hash
			};
		})
	);
}

export interface TUploadSiteAssetsConfig {
	shopId: string;
	accessToken: string;
}

export interface TUploadedAsset {
	id: string;
	url: string;
	originalHash: string;
}
