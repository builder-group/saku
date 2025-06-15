import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

export const FILE_CREATE = gql(`
	mutation fileCreate($files: [FileCreateInput!]!) {
		fileCreate(files: $files) {
			files {
				id
				fileStatus
				alt
				createdAt
			}
			userErrors {
				field
				message
			}
		}
	}
`);

export async function createShopifyFile(
	shopId: string,
	accessToken: string,
	input: {
		alt: string;
		contentType: 'IMAGE' | 'VIDEO' | 'FILE';
		originalSource: string;
	}
): Promise<void> {
	const result = await shopifyAdminApiClient.query(FILE_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			files: [
				{
					alt: input.alt,
					contentType: input.contentType,
					originalSource: input.originalSource
				}
			]
		},
		headers: {
			'X-Shopify-Access-Token': accessToken
		}
	});

	if (result.isErr()) {
		throw new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
			detail: `Shopify API request failed: ${result.error.message}`
		});
	}

	const fileCreate = result.value.data?.data?.fileCreate;
	if (fileCreate == null) {
		throw new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
			detail: 'No data returned from GraphQL query'
		});
	}

	const { files, userErrors } = fileCreate;
	if (userErrors != null && userErrors.length > 0) {
		throw new AppError('#ERR_SHOPIFY_USER_ERROR', 400, {
			detail: `Shopify errors: ${userErrors.map((error) => error.message).join(', ')}`
		});
	}

	if (!files?.length) {
		throw new AppError('#ERR_NO_FILE_CREATED', 500, {
			detail: 'No file was created in Shopify'
		});
	}
}
