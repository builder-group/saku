import { createId, TAsset, TFlatSite, toFlatSite, TShopifyIntegration } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq, isNull, ne } from 'drizzle-orm';
import { unwrapOrNull, unwrapOrUndefined } from 'tuple-result';
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
	deleteShopifyUrlRedirect,
	deleteUrlRedirect,
	extractThemeDataFromSettings,
	getCurrentPlan,
	getMainTheme,
	getParsedThemeSettingsData,
	getRecommendedProducts,
	getShopifyOfflineAccessToken,
	getShopInfo,
	getShopPlan,
	getShopPrimaryUrl,
	getWorkspaceStorefrontAccessToken,
	prepareSiteContent,
	updateShopifyUrlRedirect,
	verifyShopifySession
} from '@/lib';
import { TFlatSiteContentDto } from '../v1.site/schema';
import { uploadSiteAssets } from './lib';
import {
	CreateShopifySiteRoute,
	DeleteShopifySiteRoute,
	GetBlankPresetRoute,
	GetShopifySiteByShopAndHandleRoute,
	GetShopifySitesRoute,
	UpdateShopifySiteRoute,
	UploadSiteAssetsRoute
} from './schema';
import { blankPreset } from './site-presets';

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
	const siteContent = await prepareSiteContent(site.id, site.workspaceId, site.content);

	return c.json(
		{
			id: site.id,
			content: siteContent as TFlatSiteContentDto
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
		overrideRedirect = false,
		uploadAssets = false
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

	// Check plan restrictions for site creation
	const currentPlan = await getCurrentPlan(shopId);
	const existingSites = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.where(eq(siteTable.workspaceId, workspace.id));
	if (existingSites.length >= 1 && currentPlan.key !== 'awesome') {
		throw new AppError('#ERR_PLAN_RESTRICTION', 403, {
			title: 'Plan restriction',
			detail:
				'You can only create one site with your current plan. Upgrade to Awesome plan to create multiple sites.'
		});
	}

	// Create URL redirect if requested
	let redirectId: string | null = null;
	if (createRedirect) {
		const [isUpdatedShopifyUrlRedirectOk, updatedShopifyUrlRedirectErr, updatedShopifyUrlRedirect] =
			await updateShopifyUrlRedirect(
				`/${handle}` as `/${string}`,
				`${shopifyConfig.proxy.path}/${handle}` as `/${string}`,
				{
					shopId,
					accessToken,
					override: overrideRedirect
				}
			);
		if (!isUpdatedShopifyUrlRedirectOk) {
			if (updatedShopifyUrlRedirectErr.code === '#ERR_REDIRECT_PATH_TAKEN' && !overrideRedirect) {
				throw new AppError('#ERR_REDIRECT_PATH_TAKEN', 409, {
					title: 'Path already taken',
					detail: `The path (${handle}) you are trying to use is already taken. Please try a different path.`
				});
			}
			throw new AppError('#ERR_REDIRECT_CREATE_FAILED', 500, {
				title: 'Failed to create redirect',
				detail: 'Could not create URL redirect for the site',
				throwable: updatedShopifyUrlRedirectErr
			});
		}
		redirectId = updatedShopifyUrlRedirect.id;
	}

	// Add Shopify integration if it doesn't exist yet
	const existingShopifyIntegration = Object.values(content.integrations).find(
		(integration) => integration.type === 'shopify' && integration.shopId === shopId
	);
	if (existingShopifyIntegration == null) {
		const [isStorefrontAccessTokenOk, , storefrontAccessToken] =
			await getWorkspaceStorefrontAccessToken(workspace.id, {
				accessToken,
				shopId
			});
		if (isStorefrontAccessTokenOk) {
			const shopPlan = unwrapOrNull(
				await getShopPlan({
					shopId,
					accessToken
				})
			);
			const primaryUrlResult = unwrapOrUndefined(
				await getShopPrimaryUrl({
					shopId,
					accessToken
				})
			);
			const integrationId = createId('integration');
			const shopifyIntegration: TShopifyIntegration = {
				id: integrationId,
				type: 'shopify',
				shopId,
				storefrontAccessToken,
				primaryDomainUrl: primaryUrlResult?.primaryDomain?.url,
				isPartnerDevelopment: shopPlan?.plan.isPartnerDevelopment ?? false,
				isShopifyPlus: shopPlan?.plan.isShopifyPlus ?? false
			};
			content.integrations[integrationId] = shopifyIntegration;
		}
	}

	// Upload image assets to Shopify if requested
	if (uploadAssets) {
		const imageAssets = Object.values(content.assets).filter((asset) => asset.type === 'image');
		const [isUploadedAssetsOk, uploadedAssetsErr, uploadedAssets] = await uploadSiteAssets(
			imageAssets,
			{ shopId, accessToken }
		);
		if (!isUploadedAssetsOk) {
			throw new AppError('#ERR_ASSETS_UPLOAD_FAILED', 500, {
				title: 'Asset upload failed',
				detail: 'Failed to upload site assets to Shopify',
				throwable: uploadedAssetsErr
			});
		}

		// Merge uploaded asset URLs back into site
		for (const uploadedAsset of uploadedAssets) {
			const asset = content.assets[uploadedAsset.originalHash];
			if (asset != null) {
				asset.storage = {
					type: 'url',
					url: uploadedAsset.url
				};
			}
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
				logger.warn('Failed to clean up redirect after site creation failed:', deleteResult.error);
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

router.openapi(UpdateShopifySiteRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { siteId } = c.req.valid('param');
	const body = c.req.valid('json');

	// Find site connected to a workspace connected to this Shopify shop
	const [site] = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle
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
	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found or you don't have access to it`
		});
	}

	// Check if handle is already taken by a different site in the same workspace (if handle is being updated)
	if (body.handle != null && body.handle !== site.handle) {
		const [siteWithHandle] = await db
			.select({ id: siteTable.id })
			.from(siteTable)
			.where(
				and(
					eq(siteTable.workspaceId, site.workspaceId),
					eq(siteTable.handle, body.handle),
					ne(siteTable.id, siteId)
				)
			)
			.limit(1);
		if (siteWithHandle != null) {
			throw new AppError('#ERR_SITE_HANDLE_TAKEN', 409, {
				title: 'Handle already taken',
				detail: `The handle "${body.handle}" is already used by another site in this workspace`
			});
		}
	}

	// Check if user is allowed to update watermarkVisible in page node (if content is being updated)
	const content = body.content as TFlatSite | undefined;
	if (content != null) {
		const currentPlan = await getCurrentPlan(shopId);
		const rootNode = content.nodes[content.rootId];
		if (
			rootNode != null &&
			rootNode.type === 'page' &&
			!rootNode.watermarkVisible &&
			currentPlan.key !== 'awesome'
		) {
			rootNode.watermarkVisible = true;
		}
	}

	// Update site
	const [updatedSite] = await db
		.update(siteTable)
		.set({
			...(body.handle != null && { handle: body.handle }),
			...(body.displayName != null && { displayName: body.displayName }),
			...(content != null && { content }),
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
	if (updatedSite == null) {
		throw new AppError('#ERR_SITE_UPDATE_FAILED', 500, {
			title: 'Update failed',
			detail: 'Failed to update site'
		});
	}

	// Update redirect (if handle was updated)
	if (updatedSite.handle !== site.handle) {
		const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();
		const result = await updateShopifyUrlRedirect(
			`/${updatedSite.handle}` as `/${string}`,
			`${shopifyConfig.proxy.path}/${updatedSite.handle}` as `/${string}`,
			{ shopId, accessToken, oldPath: `/${site.handle}` as `/${string}` }
		);
		if (result.isErr()) {
			throw new AppError('#ERR_REDIRECT_UPDATE_FAILED', 500, {
				title: 'Failed to update redirect',
				detail: 'Could not update URL redirect for the site',
				throwable: result.error
			});
		}
	}

	return c.json(
		{
			id: updatedSite.id,
			workspaceId: updatedSite.workspaceId,
			handle: updatedSite.handle,
			displayName: updatedSite.displayName ?? undefined,
			content: updatedSite.content as TFlatSiteContentDto,
			createdAt: updatedSite.createdAt.toISOString(),
			updatedAt: updatedSite.updatedAt.toISOString()
		},
		200
	);
});

router.openapi(DeleteShopifySiteRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { siteId } = c.req.valid('param');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Find site connected to a workspace connected to this Shopify shop
	const [site] = await db
		.select({
			id: siteTable.id,
			workspaceId: siteTable.workspaceId,
			handle: siteTable.handle
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
	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with ID ${siteId} was not found or you don't have access to it`
		});
	}

	// Prevent deletion if this is the last site
	const sites = await db
		.select({
			id: siteTable.id
		})
		.from(siteTable)
		.where(eq(siteTable.workspaceId, site.workspaceId));
	if (sites.length <= 1) {
		throw new AppError('#ERR_CANNOT_DELETE_LAST_SITE', 409, {
			title: 'Cannot delete last site',
			detail: 'You cannot delete the last site in your workspace. At least one site must remain.'
		});
	}

	// Delete the site
	await db.delete(siteTable).where(eq(siteTable.id, siteId));

	// Try to delete the associated redirect
	const deleteResult = await deleteShopifyUrlRedirect({
		path: `/${site.handle}` as `/${string}`,
		shopId,
		accessToken
	});
	if (deleteResult.isErr()) {
		logger.warn('Failed to delete redirect after site deletion:', deleteResult.error);
	}

	return c.json({ success: true }, 200);
});

router.openapi(UploadSiteAssetsRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const { assets } = c.req.valid('json');

	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	const [isUploadedAssetsOk, uploadedAssetsErr, uploadedAssets] = await uploadSiteAssets(
		assets as TAsset[],
		{
			shopId,
			accessToken
		}
	);
	if (!isUploadedAssetsOk) {
		throw new AppError('#ERR_ASSETS_UPLOAD_FAILED', 500, {
			title: 'Asset upload failed',
			detail: 'Failed to upload site assets to Shopify',
			throwable: uploadedAssetsErr
		});
	}

	return c.json(
		{
			uploadedAssets
		},
		200
	);
});

router.openapi(GetBlankPresetRoute, async (c) => {
	const { shopId } = (await verifyShopifySession(c)).unwrap();
	const accessToken = (await getShopifyOfflineAccessToken(shopId)).unwrap();

	// Get shop info
	const [isShopInfoOk, shopInfoErr, shopInfo] = await getShopInfo({
		shopId,
		accessToken
	});
	if (!isShopInfoOk) {
		throw new AppError('#ERR_SHOP_INFO_FETCH_FAILED', 500, {
			title: 'Failed to fetch shop info',
			detail: shopInfoErr.message
		});
	}

	// Get main theme
	const mainThemeResult = await getMainTheme({
		shopId,
		accessToken
	});
	if (mainThemeResult.isErr()) {
		throw new AppError('#ERR_THEME_FETCH_FAILED', 500, {
			title: 'Failed to fetch theme',
			detail: mainThemeResult.error.message
		});
	}
	const theme = mainThemeResult.value;

	// Get main theme settings
	const [isThemeSettingsOk, themeSettingsErr, themeSettings] = await getParsedThemeSettingsData(
		theme.id,
		{
			shopId,
			accessToken
		}
	);
	if (!isThemeSettingsOk) {
		throw new AppError('#ERR_THEME_SETTINGS_FETCH_FAILED', 500, {
			title: 'Failed to fetch theme settings',
			detail: themeSettingsErr.message
		});
	}
	const themeData = await extractThemeDataFromSettings(themeSettings.settingsData, {
		shopId,
		accessToken
	});

	// Get recommended products
	const [isRecommendedProductsOk, recommendedProductsErr, recommendedProducts] =
		await getRecommendedProducts(
			{ first: 1 },
			{
				shopId,
				accessToken
			}
		);
	if (!isRecommendedProductsOk) {
		throw new AppError('#ERR_RECOMMENDED_PRODUCTS_FETCH_FAILED', 500, {
			title: 'Failed to fetch recommended products',
			detail: recommendedProductsErr.message
		});
	}

	// Create blank preset
	const site = blankPreset({
		shopId,
		title: shopInfo.name,
		avatar: themeData.logo,
		socialLinks: themeData.socialLinks,
		featuredProduct: recommendedProducts.products[0] ?? undefined
	});

	return c.json(
		{
			id: 'blank',
			label: 'Blank Preset',
			content: toFlatSite(site) as TFlatSiteContentDto
		},
		200
	);
});
