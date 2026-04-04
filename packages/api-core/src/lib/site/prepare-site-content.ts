import { migrateSite, TFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, logger, redisClient, siteTable, workspaceAccountTable } from '@/environment';
import { refreshIntegrations } from './refresh-integrations';
import { refreshShopifyProducts } from './refresh-shopify-products';

/**
 * Prepares site content for use by validating, migrating, and refreshing integrations.
 * This is the ONLY safe way to use site.content from the database.
 *
 * Steps:
 * 1. Validates basic structure
 * 2. Migrates to latest version (if needed)
 * 3. Refreshes integrations (access tokens, etc.)
 * 4. Refreshes Shopify product snapshots
 * 5. Persists changes to database (if modified)
 *
 * @param siteId - The site ID
 * @param workspaceId - The workspace ID (for integration refresh)
 * @param rawContent - Raw content from database (unknown type)
 * @returns Fully prepared site content (latest version, fresh integrations)
 */
export async function prepareSiteContent(
	siteId: string,
	workspaceId: string,
	rawContent: unknown
): Promise<TFlatSite> {
	let content: TFlatSite = rawContent as TFlatSite;
	let contentChanged = false;

	// Step 1: Validate basic structure
	if (!content || typeof content !== 'object' || !('version' in content)) {
		throw new AppError('#ERR_INVALID_SITE_CONTENT', 500, {
			title: 'Invalid site content',
			detail: 'Site content is missing required fields'
		});
	}

	// Step 2: Migrate to latest version
	const [isMigratedSiteOk, migratedSiteErr, migratedSite] = migrateSite(rawContent as TFlatSite);
	if (!isMigratedSiteOk) {
		throw new AppError('#ERR_FAILED_TO_MIGRATE_SITE', 500, {
			title: 'Failed to migrate site',
			detail: 'Failed to migrate site',
			throwable: migratedSiteErr
		});
	}
	if (migratedSite.migrated) {
		content = migratedSite.site;
		contentChanged = true;
		logger.info('Site migrated successfully', {
			siteId,
			fromVersion: migratedSite.fromVersion,
			toVersion: migratedSite.toVersion
		});
	}

	// Step 3: Refresh integrations
	const refreshResult = await refreshIntegrations({
		workspaceId,
		integrations: content.integrations
	});
	if (refreshResult.updatedIntegrationIds.length > 0) {
		content.integrations = refreshResult.integrations;
		contentChanged = true;
		logger.info('Site integrations refreshed', {
			siteId,
			updatedIntegrations: refreshResult.updatedIntegrationIds
		});
	}

	// Step 4: Refresh Shopify product snapshots
	const productRefreshResult = await refreshShopifyProducts(content);
	if (productRefreshResult.updatedNodeIds.length > 0) {
		content = productRefreshResult.content;
		contentChanged = true;
		logger.info('Site Shopify products refreshed', {
			siteId,
			updatedNodes: productRefreshResult.updatedNodeIds
		});
	}

	// Step 5: Persist changes if content was modified
	if (contentChanged) {
		const [updatedSite] = await db
			.update(siteTable)
			.set({
				content,
				updatedAt: new Date()
			})
			.where(eq(siteTable.id, siteId))
			.returning({ handle: siteTable.handle });
		if (updatedSite != null) {
			const shopifyAccounts = await db
				.select({ shopId: workspaceAccountTable.providerAccountId })
				.from(workspaceAccountTable)
				.where(
					and(
						eq(workspaceAccountTable.workspaceId, workspaceId),
						eq(workspaceAccountTable.provider, 'shopify')
					)
				);

			// Drop published cache when prepared content changes so lazy Shopify refresh reaches
			// public pages without waiting for TTL expiry
			await Promise.all(
				shopifyAccounts.map(({ shopId }) => redisClient.deleteSiteCache(shopId, updatedSite.handle))
			);
		}
	}

	return content;
}
