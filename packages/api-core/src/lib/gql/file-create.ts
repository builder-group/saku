import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig, VariablesOf } from '@/environment';

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

export async function createFiles(
	shopId: string,
	accessToken: string,
	files: TFileInput[]
): Promise<TResult<TFile[], AppError>> {
	const result = await shopifyAdminApiClient.query(FILE_CREATE, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { files },
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

	const fileCreate = result.value.data?.fileCreate;
	if (!fileCreate?.files?.length) {
		return Err(
			new AppError('#ERR_NO_FILES_CREATED', 500, {
				detail: 'No files were created in Shopify'
			})
		);
	}

	// Check for user errors
	if (fileCreate.userErrors?.length) {
		return Err(
			new AppError('#ERR_USER_ERROR', 400, {
				detail: fileCreate.userErrors.map((e) => e.message).join(', ')
			})
		);
	}

	// Map and validate each file
	const createdFiles = fileCreate.files.map((file) => {
		if (file?.id == null || file?.fileStatus == null || file?.createdAt == null) {
			throw new AppError('#ERR_INVALID_RESPONSE', 500, {
				detail: 'Invalid file data returned from Shopify'
			});
		}

		return {
			id: file.id,
			fileStatus: file.fileStatus,
			alt: file.alt ?? '',
			createdAt: file.createdAt
		};
	});

	return Ok(createdFiles);
}

export type TFileInput = VariablesOf<typeof FILE_CREATE>['files'][number];

export type TFile = {
	id: string;
	fileStatus: string;
	alt: string;
	createdAt: string;
};
