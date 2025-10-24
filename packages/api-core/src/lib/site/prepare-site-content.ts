import { migrateSite, TFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { db, logger, siteTable } from '@/environment';
import { refreshIntegrations } from './refresh-integrations';

/**
 * Prepares site content for use by validating, migrating, and refreshing integrations.
 * This is the ONLY safe way to use site.content from the database.
 *
 * Steps:
 * 1. Validates basic structure
 * 2. Migrates to latest version (if needed)
 * 3. Refreshes integrations (access tokens, etc.)
 * 4. Persists changes to database (if modified)
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

	// Step 4: Persist changes if content was modified
	if (contentChanged) {
		await db
			.update(siteTable)
			.set({
				content,
				updatedAt: new Date()
			})
			.where(eq(siteTable.id, siteId));
	}

	return content;
}
