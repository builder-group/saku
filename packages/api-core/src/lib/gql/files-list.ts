import { Err, notEmpty, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { gql, shopifyAdminApiClient, shopifyConfig } from '@/environment';

// https://shopify.dev/docs/api/admin-graphql/latest/queries/files
export const FILES_LIST = gql(`
  query filesList(
    $first: Int!, 
    $after: String, 
    $query: String,
    $sortKey: FileSortKeys
  ) {
    files(
      first: $first, 
      after: $after,
      query: $query,
      sortKey: $sortKey
    ) {
      nodes {
        id
        alt
        createdAt
        preview {
          image {
            id
            url
          }
        }
        ... on MediaImage {
          __typename
          id
          image {
            id
            url
            width
            height
          }
          mimeType
        }
        ... on Video {
          __typename
          id
          sources {
            url
            format
            height
            width
          }
        }
        ... on GenericFile {
          __typename
          id
          mimeType
          url
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export async function listFiles(
	shopId: string,
	accessToken: string,
	input: TFilesListInput
): Promise<TResult<TFilesListSuccess, AppError>> {
	const { first = 20, after, query, sortKey = 'CREATED_AT' } = input;

	// Convert structured query to string if needed
	const queryString =
		typeof query === 'object' && query != null
			? [
					query.fileName && `filename:${query.fileName}`,
					...(query.fileTypes?.map((type) => `mediaType:${type}`) ?? [])
				]
					.filter(Boolean)
					.join(' AND ')
			: query;

	const result = await shopifyAdminApiClient.query(FILES_LIST, {
		prefixUrl: shopifyConfig.shop.adminApi(shopId),
		variables: {
			first,
			after,
			query: queryString,
			sortKey
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

	const files = result.value.data?.files;
	return Ok({
		files: files.nodes
			.map((file) => {
				let fileDetails: TFileDetails | null = null;
				let fileUrl: string | null = null;
				switch (file.__typename) {
					case 'MediaImage':
						if (file.image != null) {
							fileUrl = file.image.url;
							fileDetails = {
								type: 'image',
								id: file.image.id ?? undefined,
								width: file.image.width ?? undefined,
								height: file.image.height ?? undefined,
								mimeType: file.mimeType ?? undefined
							};
						}
						break;
					case 'Video':
						if (file.sources?.[0] != null) {
							fileUrl = file.sources[0].url;
							fileDetails = {
								type: 'video',
								width: file.sources[0].width,
								height: file.sources[0].height,
								format: file.sources[0].format
							};
						}
						break;
					case 'GenericFile':
						if (file.url != null) {
							fileUrl = file.url;
							fileDetails = {
								type: 'file',
								mimeType: file.mimeType ?? undefined
							};
						}
						break;
					default:
					// do nothing
				}

				if (fileDetails == null || fileUrl == null) {
					return null;
				}

				return {
					id: file.id,
					alt: file.alt ?? '',
					createdAt: file.createdAt,
					fileName: new URL(fileUrl).pathname.split('/').pop()?.split('?')[0] ?? '',
					previewImage:
						file.preview?.image?.id != null && file.preview?.image?.url != null
							? {
									id: file.preview.image.id,
									url: file.preview.image.url
								}
							: undefined,
					url: fileUrl,
					details: fileDetails
				};
			})
			.filter(notEmpty),
		pageInfo: {
			hasNextPage: files.pageInfo.hasNextPage,
			endCursor: files.pageInfo.endCursor ?? undefined
		}
	});
}

export type TFileType = 'IMAGE' | 'VIDEO' | 'FILE' | 'MODEL_3D' | 'EXTERNAL_VIDEO';

export interface TFilesListStructuredQuery {
	fileTypes?: TFileType[];
	fileName?: string;
}

export interface TFilesListInput {
	first?: number;
	after?: string;
	query?: string | TFilesListStructuredQuery;
	sortKey?: 'CREATED_AT' | 'FILENAME' | 'ID' | 'ORIGINAL_UPLOAD_SIZE' | 'RELEVANCE' | 'UPDATED_AT';
}

export type TFilesListSuccess = {
	files: {
		id: string;
		alt: string;
		createdAt: string;
		fileName: string;
		previewImage?: {
			id: string;
			url: string;
		};
		url: string;
		details: TFileDetails;
	}[];
	pageInfo: {
		hasNextPage: boolean;
		endCursor?: string;
	};
};

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
