import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import { pika } from '@/environment';
import {
	createFiles,
	createStagedUploads,
	getShopifyOfflineAccessToken,
	listFiles,
	verifyShopifySession
} from '@/lib';
import { mapContentTypeToResource } from './lib';
import {
	CreateUploadTargetsRoute,
	ListMediaFilesRoute,
	SubmitUploadedFilesRoute,
	TSubmitUploadedFileErrorDto,
	TSubmitUploadedFileSuccessDto
} from './schema';

router.openapi(CreateUploadTargetsRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);
	const { files } = c.req.valid('json');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const createdTargets = (
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

	return c.json(
		{
			files: createdTargets.map((target) => ({
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
	const { shopId } = await verifyShopifySession(c);
	const { files } = c.req.valid('json');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const createdFiles = (
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

	if (createdFiles.length !== files.length) {
		throw new AppError('#ERR_INVALID_RESPONSE', 500, {
			detail: 'Invalid response from Shopify'
		});
	}

	return c.json(
		{
			files: files.map((inputFile, index) => {
				const createdFile = createdFiles[index];
				if (createdFile == null) {
					return {
						uploadId: inputFile.uploadId,
						status: 'ERROR',
						error: 'File creation failed'
					} satisfies TSubmitUploadedFileErrorDto;
				}

				return {
					id: createdFile.id,
					uploadId: inputFile.uploadId,
					status: 'SUCCESS'
				} satisfies TSubmitUploadedFileSuccessDto;
			})
		},
		200
	);
});

router.openapi(ListMediaFilesRoute, async (c) => {
	const { shopId } = await verifyShopifySession(c);
	const { first, after, fileTypes, fileName, sortKey, reverse } = c.req.valid('query');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const { files, pageInfo } = (
		await listFiles(
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
