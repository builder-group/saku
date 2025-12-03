import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectdelete
export const METAOBJECT_DELETE = gql(`
	mutation metaobjectDelete($id: ID!) {
		metaobjectDelete(id: $id) {
			deletedId
			userErrors {
				code
				field
				message
			}
		}
	}
`);

export async function deleteMetaobject(
	input: TDeleteMetaobjectInput,
	config: TDeleteMetaobjectConfig
): Promise<TResult<TDeleteMetaobjectSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(METAOBJECT_DELETE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { id: input.id },
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

	const metaobjectDelete = result.value.data?.metaobjectDelete;
	if (metaobjectDelete == null) {
		return Err(
			new AppError('#ERR_METAOBJECT_DELETE_FAILED', 500, {
				detail: 'Metaobject delete failed'
			})
		);
	}

	const { deletedId, userErrors } = metaobjectDelete;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (deletedId == null) {
		return Err(
			new AppError('#ERR_METAOBJECT_DELETE_FAILED', 500, {
				detail: 'No metaobject was deleted in Shopify'
			})
		);
	}

	return Ok({
		id: deletedId
	});
}

interface TDeleteMetaobjectConfig {
	shopId: string;
	accessToken: string;
}

export interface TDeleteMetaobjectInput {
	id: string;
}

export interface TDeleteMetaobjectSuccess {
	id: string;
}
