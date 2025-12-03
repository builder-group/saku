import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobject
export const METAOBJECT = gql(`
	query metaobject($id: ID!) {
		metaobject(id: $id) {
			id
			handle
			fields {
				key
				value
			}
		}
	}
`);

export async function getMetaobjectById(
	input: TGetMetaobjectByIdInput,
	config: TGetMetaobjectByIdConfig
): Promise<TResult<TGetMetaobjectByIdSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(METAOBJECT, {
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

	const metaobject = result.value.data?.metaobject;
	if (metaobject == null) {
		return Err(
			new AppError('#ERR_METAOBJECT_NOT_FOUND', 404, {
				detail: `Metaobject with id '${input.id}' not found`
			})
		);
	}

	const fields = metaobject.fields.reduce(
		(acc, field) => {
			if (field.value != null) {
				acc[field.key] = field.value;
			}
			return acc;
		},
		{} as Record<string, string>
	);

	return Ok({
		id: metaobject.id,
		handle: metaobject.handle,
		fields
	});
}

interface TGetMetaobjectByIdConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetMetaobjectByIdInput {
	id: string;
}

export interface TGetMetaobjectByIdSuccess {
	id: string;
	handle: string;
	fields: Record<string, string>;
}
