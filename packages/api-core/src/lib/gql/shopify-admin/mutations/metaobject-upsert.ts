import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectupsert
export const METAOBJECT_UPSERT = gql(`
	mutation metaobjectUpsert($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
		metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
			metaobject {
				id
				handle
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`);

export async function upsertMetaobject(
	input: TMetaobjectUpsertInput,
	config: TUpsertMetaobjectConfig
): Promise<TResult<TUpsertMetaobjectSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(METAOBJECT_UPSERT, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			handle: { handle: input.handle, type: input.type },
			metaobject: { fields: input.fields }
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

	const metaobjectUpsert = result.value.data?.metaobjectUpsert;
	if (metaobjectUpsert == null) {
		return Err(
			new AppError('#ERR_METAOBJECT_UPSERT_FAILED', 500, {
				detail: 'Metaobject upsert failed'
			})
		);
	}

	const { metaobject, userErrors } = metaobjectUpsert;
	if (userErrors?.length > 0) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: userErrors.map((e) => e.message).join(', '),
				errors: userErrors
			})
		);
	}
	if (metaobject == null) {
		return Err(
			new AppError('#ERR_METAOBJECT_UPSERT_FAILED', 500, {
				detail: 'No metaobject was created/updated'
			})
		);
	}

	return Ok({
		id: metaobject.id,
		handle: metaobject.handle
	});
}

interface TUpsertMetaobjectConfig {
	shopId: string;
	accessToken: string;
}

export interface TMetaobjectUpsertInput {
	handle: string;
	type: string;
	fields: Array<{ key: string; value: string }>;
}

export interface TUpsertMetaobjectSuccess {
	id: string;
	handle: string;
}
