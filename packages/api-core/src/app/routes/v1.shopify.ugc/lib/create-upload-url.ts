import { AppError } from '@repo/hono-utils';
import { gql } from 'feature-fetch';
import { shopifyAdminApiClient, shopifyConfig } from '@/environment';
import { getShopifyShopAccessToken } from '../../../../lib';
import type { TCreateUploadUrlRequestDto, TCreateUploadUrlResponseDto } from '../schema';

export async function createUploadUrl(
	shopId: string,
	input: TCreateUploadUrlRequestDto
): Promise<TCreateUploadUrlResponseDto> {
	const accessToken = await getShopifyShopAccessToken(shopId);

	const result = await shopifyAdminApiClient.query<TStagedUploadResponse, TStagedUploadVariables>(
		STAGED_UPLOADS_CREATE,
		{
			prefixUrl: shopifyConfig.shop.adminApi(shopId),
			variables: {
				input: [
					{
						filename: input.filename,
						mimeType: input.mimeType,
						resource: mapContentTypeToResource(input.contentType),
						httpMethod: 'POST',
						fileSize: input.fileSize.toString()
					}
				]
			},
			headers: {
				'X-Shopify-Access-Token': accessToken
			}
		}
	);

	if (result.isErr()) {
		throw new AppError('#ERR_SHOPIFY_API_ERROR', 500, {
			detail: `Shopify API request failed: ${result.error.message}`
		});
	}

	const { stagedTargets, userErrors } = result.value.data.data.stagedUploadsCreate;

	if (userErrors.length > 0) {
		throw new AppError('#ERR_SHOPIFY_USER_ERROR', 400, {
			detail: `Shopify errors: ${userErrors.map((error) => error.message).join(', ')}`
		});
	}

	if (!stagedTargets.length) {
		throw new AppError('#ERR_NO_UPLOAD_TARGET', 500, {
			detail: 'No upload target returned from Shopify'
		});
	}

	const target = stagedTargets[0] as TStagedTarget;
	const uploadId = `ugc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

	return {
		uploadTarget: {
			url: target.url,
			resourceUrl: target.resourceUrl,
			parameters: target.parameters
		},
		uploadId,
		expiresAt
	};
}

function mapContentTypeToResource(contentType: string): 'IMAGE' | 'VIDEO' | 'FILE' {
	switch (contentType) {
		case 'IMAGE':
			return 'IMAGE';
		case 'VIDEO':
			return 'VIDEO';
		case 'FILE':
			return 'FILE';
		default:
			throw new AppError('#ERR_INVALID_CONTENT_TYPE', 400, {
				detail: `Unsupported content type: ${contentType}`
			});
	}
}

const STAGED_UPLOADS_CREATE = gql`
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
`;

interface TStagedUploadInput {
	filename: string;
	mimeType: string;
	resource: 'IMAGE' | 'VIDEO' | 'FILE';
	httpMethod: 'POST';
	fileSize: string;
}

interface TStagedUploadVariables {
	input: [TStagedUploadInput];
}

interface TStagedTarget {
	url: string;
	resourceUrl: string | null;
	parameters: Array<{ name: string; value: string }>;
}

interface TStagedUploadResponse {
	data: {
		stagedUploadsCreate: {
			stagedTargets: Array<TStagedTarget>;
			userErrors: Array<{ field: string[]; message: string }>;
		};
	};
	errors?: Array<{ message: string }>;
}
