import { tokenRef } from '../lib';
import {
	TBannerStyleToken,
	TBasicLinkNodeContentMixin,
	TFlatSite,
	TLatestSiteVersion,
	TSiteVersion
} from '../types';
import { nodeMetadataMap } from './node-metadata';

// =========================================================================
// v0.0.1 -> v0.0.2
// =========================================================================

const v001ToV002: TSiteMigration = {
	to: 'v0.0.2',
	migrate(site) {
		const migratedNodes = Object.fromEntries(
			Object.entries(site.nodes).map(([id, node]) => {
				// Migrate basic link node content
				if (node.type === 'link' && node.content.type === 'basic') {
					const {
						title,
						description,
						thumbnail,
						userTitle,
						userDescription,
						userThumbnail,
						...restContent
					} = node.content as TV001BasicLinkNodeContent;

					return [
						id,
						{
							...node,
							content: {
								...restContent,
								metadata: {
									title,
									description,
									thumbnail
								},
								overrides: {
									title: userTitle,
									description: userDescription,
									thumbnail: userThumbnail
								}
							} satisfies TBasicLinkNodeContentMixin['value']
						}
					];
				}

				// Migrate single product node content
				if (node.type === 'product' && node.content.type === 'single') {
					return [
						id,
						{
							...node,
							content: {
								...node.content,
								overrides: {}
							},
							banner: nodeMetadataMap.product.bundleMap.classic.banner
						}
					];
				}

				return [id, node];
			})
		);

		// Add banner default token
		const bannerToken: TBannerStyleToken = {
			type: 'banner',
			key: 'banner.default',
			value: {
				appearance: {
					visible: true,
					opacity: 1
				},
				fill: {
					paint: tokenRef('paint.success', 'paint'),
					opacity: 1
				},
				stroke: null,
				shadow: null,
				text: {
					appearance: {
						visible: true,
						opacity: 1
					},
					typography: {
						font: tokenRef('font.body', 'font'),
						fontSize: tokenRef('size.text.sm', 'number'),
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.success.content', 'paint'),
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			}
		};
		const migratedTokens = {
			...site.tokens,
			[bannerToken.key]: bannerToken
		};

		return {
			...site,
			nodes: migratedNodes,
			tokens: migratedTokens
		};
	}
};

interface TV001BasicLinkNodeContent {
	type: 'basic';
	url: string;
	title?: string;
	description?: string;
	thumbnail?: string;
	userTitle?: string;
	userDescription?: string;
	userThumbnail?: string | null;
}

// =========================================================================
// Config
// =========================================================================

export const siteMigrationConfig: TSiteMigrationConfig = {
	latestVersion: 'v0.0.2',
	migrations: {
		'v0.0.1': v001ToV002
	}
};

export interface TSiteMigrationConfig {
	latestVersion: TLatestSiteVersion;
	migrations: Record<Exclude<TSiteVersion, TLatestSiteVersion>, TSiteMigration>;
}

export interface TSiteMigration {
	to: TSiteVersion;
	migrate: (site: TFlatSiteWithSiteVersion) => TFlatSiteWithSiteVersion;
}

/**
 * Used in migrations to accept any version (old or new).
 *
 * TFlatSite enforces `version: TLatestSiteVersion` to prevent version/schema mismatches
 * in app code, but migrations need to work with all versions.
 */
export type TFlatSiteWithSiteVersion = Omit<TFlatSite, 'version'> & {
	version: TSiteVersion;
};
