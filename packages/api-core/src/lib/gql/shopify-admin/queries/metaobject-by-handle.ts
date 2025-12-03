import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjectbyhandle
export const METAOBJECT_BY_HANDLE = gql(`
	query metaobjectByHandle($handle: MetaobjectHandleInput!) {
		metaobjectByHandle(handle: $handle) {
			id
			handle
			fields {
				key
				value
			}
		}
	}
`);

export async function getMetaobjectByHandle(
	input: TGetMetaobjectByHandleInput,
	config: TGetMetaobjectByHandleConfig
): Promise<TResult<TGetMetaobjectByHandleSuccess | null, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(METAOBJECT_BY_HANDLE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			handle: { handle: input.handle, type: input.type }
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

	const metaobject = result.value.data?.metaobjectByHandle;
	if (metaobject == null) {
		return Ok(null);
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

interface TGetMetaobjectByHandleConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetMetaobjectByHandleInput {
	handle: string;
	type: string;
}

export interface TGetMetaobjectByHandleSuccess {
	id: string;
	handle: string;
	fields: Record<string, string>;
}
