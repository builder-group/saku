import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';
import { getFileById } from '../queries/file-get-by-id';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/fileCreate
const FILE_CREATE = gql(`
	mutation fileCreate($files: [FileCreateInput!]!) {
		fileCreate(files: $files) {
			files {
				id
				fileStatus
				alt
				createdAt
				... on MediaImage {
					__typename
					id
					image {
						url
					}
				}
				... on Video {
					__typename
					id
					sources {
						url
					}
				}
				... on GenericFile {
					__typename
					id
					url
				}
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`);

export async function createFiles(
	input: TFileCreateInput[],
	config: TCreateFilesConfig
): Promise<TResult<TFileCreateSuccess, AppError>> {
	const { shopId, accessToken, waitForUrl = true } = config;
	const result = await shopifyAdminApiClient.query(FILE_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { files: input },
		headers: {
			'X-Shopify-Access-Token': accessToken
		}
	});
	if (result.isErr()) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: `Shopify API request failed: ${result.error.message}`
			})
		);
	}

	const fileCreate = result.value.data.fileCreate;
	if (fileCreate == null) {
		return Err(
			new AppError('#ERR_NO_FILES_CREATED', 500, {
				detail: 'No files were created in Shopify'
			})
		);
	}

	const { files, userErrors } = fileCreate;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (!files?.length) {
		return Err(
			new AppError('#ERR_NO_FILES_CREATED', 500, {
				detail: 'No files were created in Shopify'
			})
		);
	}

	const createdFiles = files.map((file): TFileCreateSuccess[number] => {
		let fileUrl: string | null = null;
		switch (file.__typename) {
			case 'MediaImage':
				if (file.image != null) {
					fileUrl = file.image.url;
				}
				break;
			case 'Video':
				if (file.sources?.[0] != null) {
					fileUrl = file.sources[0].url;
				}
				break;
			case 'GenericFile':
				if (file.url != null) {
					fileUrl = file.url;
				}
				break;
			default:
			// do nothing
		}

		return {
			id: file.id,
			url: fileUrl,
			fileStatus: file.fileStatus,
			alt: file.alt ?? '',
			createdAt: file.createdAt
		};
	});

	// Poll for permanent Shopify CDN URLs with adaptive backoff
	// Files are async processed: status is UPLOADED but url is null until READY
	// We want the permanent CDN URL, not the temporary resourceUrl from staging
	// https://community.shopify.com/t/stageduploads-get-a-permanent-cdn-url/175583/5
	if (waitForUrl) {
		let attempt = 0;
		let nextPendingFiles = createdFiles.filter((file) => file.url == null);

		while (attempt < 10 && nextPendingFiles.length > 0) {
			// Poll for file URLs
			for (const file of nextPendingFiles) {
				const result = await getFileById(file.id, { shopId, accessToken });
				if (result.isOk()) {
					file.url = result.value.url;
					file.fileStatus = result.value.fileStatus;
				}
			}

			const currentPendingLength = nextPendingFiles.length;
			nextPendingFiles = createdFiles.filter((file) => file.url == null);
			if (!nextPendingFiles.length) {
				break;
			}

			// Progress = fast polling, stuck = exponential backoff
			const madeProgress = nextPendingFiles.length < currentPendingLength;
			const delay = madeProgress ? 500 : Math.min(500 * Math.pow(2, attempt), 8000);
			await new Promise((resolve) => setTimeout(resolve, delay));
			if (!madeProgress) {
				attempt++;
			}
		}
	}

	return Ok(createdFiles);
}

interface TCreateFilesConfig {
	shopId: string;
	accessToken: string;
	waitForUrl?: boolean;
}

export type TFileCreateInput = VariablesOf<typeof FILE_CREATE>['files'][number];

export type TFileCreateSuccess = {
	id: string;
	url: string | null;
	fileStatus: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
	alt: string;
	createdAt: string;
}[];
