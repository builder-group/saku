import { createId, TFlatSite, TShopifyIntegration } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq, isNull } from 'drizzle-orm';
import { unwrapOrNull } from 'tuple-result';
import { router } from '@/app/router';
import {
	db,
	logger,
	shopifyConfig,
	siteTable,
	workspaceAccountTable,
	workspaceTable
} from '@/environment';
import {
	createShopifyUrlRedirect,
	deleteUrlRedirect,
	getCurrentPlan,
	getShopifyOfflineAccessToken,
	getShopPlan,
	getStorefrontToken,
	refreshIntegrations,
	verifyShopifySession
} from '@/lib';
import { TFlatSiteContentDto } from '../v1.site/schema';
import {
	CreateShopifySiteRoute,
	GetShopifySiteByShopAndHandleRoute,
	GetShopifySitesRoute,
	UpdateShopifySiteContentRoute
} from './schema';

router.openapi(GetShopifySitesRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();

	// Find sites in workspaces that have this Shopify store connected
	const sites = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		);

	return c.json(
		sites.map((site) => ({
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		})),
		200
	);
});

router.openapi(GetShopifySiteByShopAndHandleRoute, async (c) => {
	const { shop, handle } = c.req.valid('param');

	// Find site by handle and shop id
	const [site] = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			content: siteTable.content
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shop)
			)
		)
		.where(eq(siteTable.handle, handle))
		.limit(1);
	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with handle '${handle}' not found for shop '${shop}'`
		});
	}

	// Refresh integrations
	site.content.integrations = (
		await refreshIntegrations({
			siteId: site.id,
			workspaceId: site.workspaceId,
			integrations: site.content.integrations
		})
	).integrations;

	return c.json(
		{
			id: site.id,
			content: site.content as TFlatSiteContentDto
		},
		200
	);
});

router.openapi(CreateShopifySiteRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const {
		handle,
		displayName,
		content: rawContent,
		createRedirect = true,
		overrideRedirect = false
	} = c.req.valid('json');
	const content: TFlatSite = rawContent as TFlatSite;

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Find workspace connected to this Shopify shop
	const [workspace] = await db
		.select({
			id: workspaceTable.id
		})
		.from(workspaceTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, workspaceTable.id),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		)
		.limit(1);
	if (workspace == null) {
		throw new AppError('#ERR_WORKSPACE_NOT_FOUND', 404, {
			title: 'Workspace not found',
			detail: `No workspace found for shop ${shopId}`
		});
	}

	// Check if handle already exists for this workspace
	const [existingSite] = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.where(and(eq(siteTable.workspaceId, workspace.id), eq(siteTable.handle, handle)))
		.limit(1);
	if (existingSite != null) {
		throw new AppError('#ERR_SITE_HANDLE_EXISTS', 409, {
			title: 'Handle already exists',
			detail: `A site with handle '${handle}' already exists in this workspace`
		});
	}

	// Create URL redirect if requested
	let redirectId: string | null = null;
	if (createRedirect) {
		const redirectResult = await createShopifyUrlRedirect(
			`/${handle}` as `/${string}`,
			`${shopifyConfig.proxy.path}/${handle}` as `/${string}`,
			{
				shopId,
				accessToken,
				override: overrideRedirect
			}
		);
		if (redirectResult.isErr()) {
			if (redirectResult.error.code === '#ERR_REDIRECT_PATH_TAKEN' && !overrideRedirect) {
				throw redirectResult.error;
			}
			throw new AppError('#ERR_REDIRECT_CREATE_FAILED', 500, {
				title: 'Failed to create redirect',
				detail: 'Could not create URL redirect for the site'
			});
		}
		redirectId = redirectResult.value.id;
	}

	// Check if Shopify integration already exists
	const existingShopifyIntegration = Object.values(content.integrations).find(
		(integration) => integration.type === 'shopify' && integration.shopId === shopId
	);

	// Add Shopify integration if it doesn't exist
	if (existingShopifyIntegration == null) {
		const storefrontTokenResult = await getStorefrontToken(workspace.id, {
			accessToken,
			shopId
		});

		if (storefrontTokenResult.isOk()) {
			const shopPlan = unwrapOrNull(
				await getShopPlan({
					shopId,
					accessToken
				})
			);
			const integrationId = createId('integration');
			const shopifyIntegration: TShopifyIntegration = {
				id: integrationId,
				type: 'shopify',
				shopId,
				storefrontAccessToken: storefrontTokenResult.value,
				isPartnerDevelopment: shopPlan?.plan.isPartnerDevelopment ?? false,
				isShopifyPlus: shopPlan?.plan.isShopifyPlus ?? false
			};
			content.integrations[integrationId] = shopifyIntegration;
		}
	}

	// Create the site
	const [site] = await db
		.insert(siteTable)
		.values({
			workspaceId: workspace.id,
			handle,
			displayName,
			content,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.returning({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			content: siteTable.content,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		});
	if (site == null) {
		// Site creation failed, try to clean up the redirect if one was created
		if (redirectId != null) {
			const deleteResult = await deleteUrlRedirect({ id: redirectId }, { shopId, accessToken });
			if (deleteResult.isErr()) {
				logger.error('Failed to clean up redirect after site creation failed:', deleteResult.error);
			}
		}

		throw new AppError('#ERR_SITE_CREATE_FAILED', 500, {
			title: 'Site creation failed',
			detail: 'Failed to create site'
		});
	}

	// Mark onboarding as complete (if it's the first site created)
	await db
		.update(workspaceTable)
		.set({
			onboardingCompletedAt: new Date(),
			updatedAt: new Date()
		})
		.where(and(eq(workspaceTable.id, workspace.id), isNull(workspaceTable.onboardingCompletedAt)));

	return c.json(
		{
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			content: site.content as TFlatSiteContentDto,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		},
		201
	);
});

router.openapi(UpdateShopifySiteContentRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { siteId } = c.req.valid('param');
	const { content: rawContent } = c.req.valid('json');
	const content: TFlatSite = rawContent as TFlatSite;

	// Check if site exists and belongs to a workspace connected to this Shopify shop
	const [existingSite] = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.innerJoin(
			workspaceAccountTable,
			and(
				eq(workspaceAccountTable.workspaceId, siteTable.workspaceId),
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopId)
			)
		)
		.where(eq(siteTable.id, siteId))
		.limit(1);

	if (existingSite == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found or you don't have access to it`
		});
	}

	// Check if user is allowed to update hasWatermark in page node
	const currentPlan = await getCurrentPlan(shopId);
	const rootNode = content.nodes[content.rootId];
	if (
		rootNode != null &&
		rootNode.type === 'page' &&
		!rootNode.content.hasWatermark &&
		currentPlan.key === 'free'
	) {
		rootNode.content.hasWatermark = true;
	}

	const [site] = await db
		.update(siteTable)
		.set({
			content,
			updatedAt: new Date()
		})
		.where(eq(siteTable.id, siteId))
		.returning({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle,
			displayName: siteTable.displayName,
			content: siteTable.content,
			createdAt: siteTable.createdAt,
			updatedAt: siteTable.updatedAt
		});

	if (site == null) {
		throw new AppError('#ERR_SITE_UPDATE_FAILED', 500, {
			title: 'Update failed',
			detail: 'Failed to update site content'
		});
	}

	return c.json(
		{
			id: site.id,
			workspaceId: site.workspaceId,
			handle: site.handle,
			displayName: site.displayName ?? undefined,
			content: site.content as TFlatSiteContentDto,
			createdAt: site.createdAt.toISOString(),
			updatedAt: site.updatedAt.toISOString()
		},
		200
	);
});
