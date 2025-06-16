import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

export const STAGED_UPLOADS_CREATE = gql(`
	mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
		stagedUploadsCreate(input: $input) {
			stagedTargets {
				url
				resourceUrl
				parameters {
					name
					value
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`);

export async function createStagedUpload(
	shopId: string,
	accessToken: string,
	input: {
		filename: string;
		mimeType: string;
		resource: 'IMAGE' | 'VIDEO' | 'FILE';
		fileSize: number;
	}
) {
	const result = await shopifyAdminApiClient.query(STAGED_UPLOADS_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			input: [
				{
					filename: input.filename,
					mimeType: input.mimeType,
					resource: input.resource,
					httpMethod: 'POST',
					fileSize: input.fileSize.toString()
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

	const stagedUploadsCreate = result.value.data?.stagedUploadsCreate;
	if (stagedUploadsCreate == null) {
		throw new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
			detail: 'No data returned from GraphQL query'
		});
	}

	const { stagedTargets, userErrors } = stagedUploadsCreate;
	if (userErrors != null && userErrors.length > 0) {
		throw new AppError('#ERR_SHOPIFY_USER_ERROR', 400, {
			detail: `Shopify errors: ${userErrors.map((error) => error.message).join(', ')}`
		});
	}

	if (!stagedTargets?.length) {
		throw new AppError('#ERR_NO_UPLOAD_TARGET', 500, {
			detail: 'No upload target returned from Shopify'
		});
	}

	const target = stagedTargets[0];
	if (!target?.url || !target.resourceUrl || !target.parameters) {
		throw new AppError('#ERR_INVALID_UPLOAD_TARGET', 500, {
			detail: 'Invalid upload target returned from Shopify'
		});
	}

	return target;
}
