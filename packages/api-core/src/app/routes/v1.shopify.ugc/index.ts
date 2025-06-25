import { AppError } from '@repo/hono-utils';
import { router } from '@/app/router';
import { pika } from '@/environment';
import {
	createFiles,
	createStagedUploads,
	getShopifyShopAccessToken,
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
	const input = c.req.valid('json');

	const accessToken = await getShopifyShopAccessToken(shopId);

	const createdTargets = (
		await createStagedUploads(
			shopId,
			accessToken,
			input.files.map((file) => ({
				filename: file.filename,
				mimeType: file.mimeType,
				resource: mapContentTypeToResource(file.contentType),
				fileSize: file.fileSize.toString()
			}))
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
	const input = c.req.valid('json');

	const accessToken = await getShopifyShopAccessToken(shopId);

	const createdFiles = (
		await createFiles(
			shopId,
			accessToken,
			input.files.map((file) => ({
				filename: file.filename,
				alt: file.filename,
				contentType: mapContentTypeToResource(file.contentType),
				originalSource: file.resourceUrl
			}))
		)
	).unwrap();

	if (createdFiles.length !== input.files.length) {
		throw new AppError('#ERR_INVALID_RESPONSE', 500, {
			detail: 'Invalid response from Shopify'
		});
	}

	return c.json(
		{
			files: input.files.map((inputFile, index) => {
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
	const input = c.req.valid('query');

	const accessToken = await getShopifyShopAccessToken(shopId);

	const { files, pageInfo } = (
		await listFiles(shopId, accessToken, {
			first: input.first,
			after: input.after,
			query:
				input.fileTypes != null || input.fileName != null
					? {
							fileTypes: input.fileTypes,
							fileName: input.fileName
						}
					: undefined,
			sortKey: input.sortKey,
			reverse: input.reverse
		})
	).unwrap();

	return c.json({ files, pageInfo }, 200);
});
