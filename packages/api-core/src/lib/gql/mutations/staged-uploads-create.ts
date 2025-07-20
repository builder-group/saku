import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/stagedUploadsCreate
const STAGED_UPLOADS_CREATE = gql(`
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
	input: TStagedUploadsCreateInput[],
	config: TCreateStagedUploadsConfig
): Promise<TResult<TStagedUploadsCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(STAGED_UPLOADS_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			uploads: input.map((upload) => ({
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
			new AppError('#ERR_NO_UPLOAD_TARGET_CREATED', 500, {
				detail: 'No upload targets were created in Shopify'
			})
		);
	}

	const { stagedTargets, userErrors } = stagedUploadsCreate;
	if (userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((error) => error.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (!stagedTargets?.length) {
		return Err(
			new AppError('#ERR_NO_UPLOAD_TARGET_CREATED', 500, {
				detail: 'No upload targets were created in Shopify'
			})
		);
	}

	return Ok(
		stagedTargets.map((target) => {
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
		})
	);
}

interface TCreateStagedUploadsConfig {
	shopId: string;
	accessToken: string;
}

export type TStagedUploadsCreateInput = VariablesOf<
	typeof STAGED_UPLOADS_CREATE
>['uploads'][number];

export type TStagedUploadsCreateSuccess = {
	url: string;
	resourceUrl: string;
	parameters: Array<{
		name: string;
		value: string;
	}>;
}[];
