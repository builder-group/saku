import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/node
const GET_FILE_BY_ID = gql(`
	query getFileById($id: ID!) {
		node(id: $id) {
			__typename
			... on MediaImage {
				id
				fileStatus
				alt
				createdAt
				preview {
					image {
						id
						url
					}
				}
				image {
					id
					url
					width
					height
				}
				mimeType
			}
			... on Video {
				id
				fileStatus
				alt
				createdAt
				preview {
					image {
						id
						url
					}
				}
				sources {
					url
					format
					height
					width
				}
			}
			... on GenericFile {
				id
				fileStatus
				alt
				createdAt
				preview {
					image {
						id
						url
					}
				}
				mimeType
				url
			}
		}
	}
`);

export async function getFileById(
	id: string,
	config: TGetFileByIdConfig
): Promise<TResult<TGetFileByIdSuccess, AppError>> {
	const { shopId, accessToken } = config;

	const result = await shopifyAdminApiClient.query(GET_FILE_BY_ID, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: { id },
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

	const node = result.value.data.node;
	if (node == null) {
		return Err(
			new AppError('#ERR_FILE_NOT_FOUND', 404, {
				detail: `File not found: ${id}`
			})
		);
	}

	// Extract file details
	let fileDetails: TFileDetails | null = null;
	let fileUrl: string | null = null;
	switch (node.__typename) {
		case 'MediaImage': {
			if (node.image != null) {
				fileUrl = node.image.url;
				fileDetails = {
					type: 'image',
					id: node.image.id ?? undefined,
					width: node.image.width ?? undefined,
					height: node.image.height ?? undefined,
					mimeType: node.mimeType ?? undefined
				};
			}
			break;
		}
		case 'Video': {
			if (node.sources?.[0] != null) {
				fileUrl = node.sources[0].url;
				fileDetails = {
					type: 'video',
					width: node.sources[0].width,
					height: node.sources[0].height,
					format: node.sources[0].format
				};
			}
			break;
		}
		case 'GenericFile': {
			if (node.url != null) {
				fileUrl = node.url;
				fileDetails = {
					type: 'file',
					mimeType: node.mimeType ?? undefined
				};
			}
			break;
		}
		default:
			return Err(
				new AppError('#ERR_UNSUPPORTED_FILE_TYPE', 400, {
					detail: `Unsupported file type: ${node.__typename}`
				})
			);
	}

	if (fileDetails == null || fileUrl == null) {
		return Err(
			new AppError('#ERR_FILE_URL_NOT_FOUND', 404, {
				detail: `File URL not found: ${id}`
			})
		);
	}

	return Ok({
		id: node.id,
		alt: node.alt ?? '',
		fileStatus: node.fileStatus,
		createdAt: node.createdAt,
		fileName: new URL(fileUrl).pathname.split('/').pop()?.split('?')[0] ?? '',
		previewImage:
			node.preview?.image?.id != null && node.preview?.image?.url != null
				? {
						id: node.preview.image.id,
						url: node.preview.image.url
					}
				: undefined,
		url: fileUrl,
		details: fileDetails
	});
}

interface TGetFileByIdConfig {
	shopId: string;
	accessToken: string;
}

export interface TGetFileByIdSuccess {
	id: string;
	alt: string;
	fileStatus: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
	createdAt: string;
	fileName: string;
	previewImage?: {
		id: string;
		url: string;
	};
	url: string;
	details: TFileDetails;
}

type TFileDetails =
	| {
			type: 'image';
			id?: string;
			width?: number;
			height?: number;
			mimeType?: string;
	  }
	| {
			type: 'video';
			width: number;
			height: number;
			format: string;
	  }
	| {
			type: 'file';
			mimeType?: string;
	  };
