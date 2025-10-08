import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import { pika } from '@/environment';
import {
	createFiles,
	createStagedUploads,
	getFiles,
	getShopifyOfflineAccessToken,
	mapContentTypeToResource,
	TFileCreateSuccess,
	verifyShopifySession
} from '@/lib';
import { CreateUploadTargetsRoute, ListMediaFilesRoute, SubmitUploadedFilesRoute } from './schema';

router.openapi(CreateUploadTargetsRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { files } = c.req.valid('json');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const uploadTargets = (
		await createStagedUploads(
			files.map((file) => ({
				filename: file.filename,
				mimeType: file.mimeType,
				resource: mapContentTypeToResource(file.contentType),
				fileSize: file.fileSize.toString()
			})),
			{ shopId, accessToken }
		)
	).unwrap();

	if (uploadTargets.length !== files.length) {
		throw new AppError('#ERR_CREATE_UPLOAD_TARGETS_MISMATCH', 500, {
			detail: 'Failed to create all staged upload targets'
		});
	}

	return c.json(
		{
			files: uploadTargets.map((target) => ({
				uploadTarget: {
					url: target.url,
					resourceUrl: target.resourceUrl,
					parameters: target.parameters
				},
				uploadId: pika.gen('ugc'),
				expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
			}))
		},
		201
	);
});

router.openapi(SubmitUploadedFilesRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { files } = c.req.valid('json');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const submittedFiles = (
		await createFiles(
			files.map((file) => ({
				filename: file.filename,
				alt: file.filename,
				contentType: mapContentTypeToResource(file.contentType),
				originalSource: file.resourceUrl
			})),
			{ shopId, accessToken }
		)
	).unwrap();
	if (submittedFiles.length !== files.length) {
		throw new AppError('#ERR_SUBMIT_FILES_MISMATCH', 500, {
			detail: 'Failed to submit all files'
		});
	}

	return c.json(
		{
			files: files.map((inputFile, index) => {
				const submittedFile = submittedFiles[index] as TFileCreateSuccess[number];
				return {
					id: submittedFile.id,
					uploadId: inputFile.uploadId
				};
			})
		},
		200
	);
});

router.openapi(ListMediaFilesRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { first, after, fileTypes, fileName, sortKey, reverse } = c.req.valid('query');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const { files, pageInfo } = (
		await getFiles(
			{
				first,
				after,
				query:
					fileTypes != null || fileName != null
						? {
								fileTypes,
								fileName
							}
						: undefined,
				sortKey,
				reverse
			},
			{ shopId, accessToken }
		)
	).unwrap();

	return c.json({ files, pageInfo }, 200);
});
