import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

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
	const { shopId, accessToken } = config;

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

	return Ok(
		files.map((file) => {
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

			if (fileUrl == null) {
				throw new AppError('#ERR_INVALID_FILE_DATA', 500, {
					detail: `Could not determine file URL from Shopify response for file type ${file.__typename}`
				});
			}

			return {
				id: file.id,
				url: fileUrl,
				fileStatus: file.fileStatus,
				alt: file.alt ?? '',
				createdAt: file.createdAt
			};
		})
	);
}

interface TCreateFilesConfig {
	shopId: string;
	accessToken: string;
}

export type TFileCreateInput = VariablesOf<typeof FILE_CREATE>['files'][number];

export type TFileCreateSuccess = {
	id: string;
	url: string;
	fileStatus: string;
	alt: string;
	createdAt: string;
}[];
