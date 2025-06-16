import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

export const STAGED_UPLOADS_CREATE = gql(`
	mutation stagedUploadsCreate($uploads: [StagedUploadInput!]!) {
		stagedUploadsCreate(input: $uploads) {
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

export async function createStagedUploads(
	shopId: string,
	accessToken: string,
	uploads: TStagedUploadInput[]
): Promise<TResult<TStagedMediaUploadTarget[], AppError>> {
	const result = await shopifyAdminApiClient.query(STAGED_UPLOADS_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			uploads: uploads.map((upload) => ({
				...upload,
				httpMethod: 'POST' as const
			}))
		},
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

	const stagedUploadsCreate = result.value.data?.stagedUploadsCreate;
	if (stagedUploadsCreate == null) {
		return Err(
			new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
				detail: 'No data returned from GraphQL query'
			})
		);
	}

	const { stagedTargets, userErrors } = stagedUploadsCreate;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((error) => error.message).join(', ')
			})
		);
	}

	if (!stagedTargets?.length) {
		return Err(
			new AppError('#ERR_NO_UPLOAD_TARGET', 500, {
				detail: 'No upload targets returned from Shopify'
			})
		);
	}

	// Map and validate each target
	const targets = stagedTargets.map((target) => {
		if (target?.url == null || target?.resourceUrl == null || target?.parameters == null) {
			throw new AppError('#ERR_INVALID_UPLOAD_TARGET', 500, {
				detail: 'Invalid upload target returned from Shopify'
			});
		}

		return {
			url: target.url,
			resourceUrl: target.resourceUrl,
			parameters: target.parameters
		};
	});

	return Ok(targets);
}

export type TStagedUploadInput = VariablesOf<typeof STAGED_UPLOADS_CREATE>['uploads'][number];

export type TStagedMediaUploadTarget = {
	url: string;
	resourceUrl: string;
	parameters: Array<{
		name: string;
		value: string;
	}>;
};
