import { migrateSite, TFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { eq } from 'drizzle-orm';
import { db, logger, siteTable } from '@/environment';

/**
 * Migrates a site to the latest version if needed, and persists it to the database.
 * This implements lazy migration - sites are migrated on-read rather than all at once.
 *
 * @param siteId - The site ID to migrate
 * @param content - The site content (potentially old version)
 * @returns The migrated site content (always latest version)
 */
export async function migrateSiteIfNeeded(siteId: string, content: TFlatSite): Promise<TFlatSite> {
	const [isMigratedSiteOk, migratedSiteErr, migratedSite] = migrateSite(content);
	if (!isMigratedSiteOk) {
		throw new AppError('#ERR_FAILED_TO_MIGRATE_SITE', 500, {
			title: 'Failed to migrate site',
			detail: 'Failed to migrate site',
			throwable: migratedSiteErr
		});
	}

	// Site was migrated - save it back to the database
	if (migratedSite.migrated) {
		await db
			.update(siteTable)
			.set({
				content: migratedSite.site,
				updatedAt: new Date()
			})
			.where(eq(siteTable.id, siteId));

		logger.info('Site migrated successfully', {
			siteId,
			fromVersion: migratedSite.fromVersion,
			toVersion: migratedSite.toVersion
		});
	}

	return migratedSite.site;
}
