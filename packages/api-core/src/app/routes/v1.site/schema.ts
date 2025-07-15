import { createRoute, z } from '@hono/zod-openapi';
import { TFlatSite } from '@repo/editor';
import { BadRequestResponse, JsonSuccessResponse, NotFoundResponse } from '@repo/hono-utils';

// Summary DTO (without content) for list views
export const SSiteSummaryDto = z
	.object({
		id: z.uuid().openapi({ example: '123e4567-e89b-12d3' }),
		workspaceId: z.uuid().openapi({ example: '123e4567-e89b-12d3' }),
		handle: z.string().openapi({ example: 'bio' }),
		displayName: z.string().optional().openapi({ example: 'My Bio Site' }),
		createdAt: z.iso.datetime().openapi({ example: '2024-03-20T00:00:00Z' }),
		updatedAt: z.iso.datetime().openapi({ example: '2024-03-20T00:00:00Z' })
	})
	.openapi('SiteSummaryDto');
export type TSiteSummaryDto = z.infer<typeof SSiteSummaryDto>;

// export const SSiteContentDto = z
// 	.custom<TSite>((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
// 	.openapi('SiteContentDto');
// export type TSiteContentDto = z.infer<typeof SSiteContentDto>;

export const SFlatSiteContentDto = z
	// .custom<TFlatSite>((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
	.looseObject<TFlatSite>({} as any) // TODO: z.custom doesn't work yet with 'zod-to-openapi' library (Zod v4)
	.openapi('FlatSiteContentDto', {});
export type TFlatSiteContentDto = z.infer<typeof SFlatSiteContentDto>;

// Full DTO (with content) for detailed views
export const SSiteDto = SSiteSummaryDto.merge(
	z.object({
		content: SFlatSiteContentDto
	})
).openapi('SiteDto');
export type TSiteDto = z.infer<typeof SSiteDto>;

export const GetSiteRoute = createRoute({
	method: 'get',
	path: '/v1/site/{siteId}',
	tags: ['site'],
	summary: 'Get site by ID',
	operationId: 'getSite',
	request: {
		params: z.object({
			siteId: z.uuid().openapi({
				example: '123e4567-e89b-12d3',
				description: 'Site ID'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SSiteDto),
		404: NotFoundResponse
	}
});

export const GetSiteContentRoute = createRoute({
	method: 'get',
	path: '/v1/site/{siteId}/content',
	tags: ['site'],
	summary: 'Get site content',
	operationId: 'getSiteContent',
	request: {
		params: z.object({
			siteId: z.uuid().openapi({
				example: '123e4567-e89b-12d3',
				description: 'Site ID'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SFlatSiteContentDto),
		404: NotFoundResponse
	}
});

export const ParseExternalSiteRoute = createRoute({
	method: 'get',
	path: '/v1/site/parse/external',
	tags: ['site'],
	summary: 'Parse external link-in-bio URL',
	operationId: 'parseExternalSite',
	request: {
		query: z.object({
			url: z.url().openapi({
				example: 'https://linkpop.com/johndoe',
				description: 'External link-in-bio URL to parse'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(
			z.object({
				provider: z.string().openapi({ example: 'linkpop' }),
				handle: z.string().openapi({ example: 'johndoe' }),
				content: SFlatSiteContentDto
			})
		),
		400: BadRequestResponse
	}
});

export const GetSiteContentByWorkspaceAndHandleRoute = createRoute({
	method: 'get',
	path: '/v1/site/workspace/{workspaceHandle}/{handle}/content',
	tags: ['site'],
	summary: 'Get site content by workspace handle and site handle',
	operationId: 'getSiteContentByWorkspaceAndHandle',
	request: {
		params: z.object({
			workspaceHandle: z.string().openapi({
				example: 'bennos-studio',
				description: 'Workspace handle'
			}),
			handle: z.string().openapi({
				example: 'bio',
				description: 'Site handle/slug'
			})
		})
	},
	responses: {
		200: JsonSuccessResponse(SFlatSiteContentDto),
		404: NotFoundResponse
	}
});
