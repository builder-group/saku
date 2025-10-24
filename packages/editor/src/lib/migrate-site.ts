import { Err, Ok, TResult } from 'tuple-result';
import { siteMigrationConfig, TFlatSiteWithSiteVersion } from '../environment';
import { TFlatSite, TLatestSiteVersion, TSiteVersion } from '../types';
import { EditorError } from './EditorError';

export function migrateSite(
	site: TFlatSiteWithSiteVersion
): TResult<TMigrateSiteSuccess, EditorError> {
	const originalVersion = site.version;

	// Already at latest version
	if (originalVersion === siteMigrationConfig.latestVersion) {
		return Ok({
			site: site as TFlatSite,
			migrated: false
		});
	}

	// Clone to avoid mutation
	let currentSite = structuredClone(site);

	// Keep migrating until we reach the latest version
	while (currentSite.version !== siteMigrationConfig.latestVersion) {
		const migration = siteMigrationConfig.migrations[currentSite.version];
		if (migration == null) {
			return Err(
				new EditorError('#ERR_INVALID_SITE_VERSION', {
					detail: `No migration path found for version ${currentSite.version}`
				})
			);
		}

		try {
			currentSite = migration.migrate(currentSite);
			currentSite.version = migration.to;
		} catch (error) {
			return Err(
				new EditorError('#ERR_FAILED_TO_MIGRATE_SITE', {
					detail: 'Failed to migrate site',
					throwable: error instanceof Error ? error : undefined
				})
			);
		}
	}

	return Ok({
		site: currentSite as TFlatSite,
		migrated: true,
		fromVersion: originalVersion,
		toVersion: currentSite.version as TLatestSiteVersion
	});
}

export type TMigrateSiteSuccess = {
	site: TFlatSite;
} & ({ migrated: true; fromVersion: TSiteVersion; toVersion: TSiteVersion } | { migrated: false });
