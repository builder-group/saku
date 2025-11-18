import { TIntegration, TIntegrationId } from '@repo/editor';
import { and, eq } from 'drizzle-orm';
import { unwrapOrUndefined } from 'tuple-result';
import { db, workspaceAccountTable } from '@/environment';
import {
	getShopifyOfflineAccessToken,
	getShopPrimaryUrl,
	getWorkspaceStorefrontAccessToken
} from '@/lib';

export async function refreshIntegrations(
	config: TRefreshIntegrationsConfig
): Promise<TRefreshIntegrationsResult> {
	const { workspaceId, integrations } = config;

	const updatedIntegrations = { ...integrations };
	const updatedIntegrationIds: TIntegrationId[] = [];

	for (const [integrationId, integration] of Object.entries(updatedIntegrations)) {
		switch (integration.type) {
			case 'shopify': {
				const shouldRefreshToken =
					integration.storefrontAccessTokenRefreshAt == null ||
					new Date(integration.storefrontAccessTokenRefreshAt).getTime() <= Date.now();
				const shouldFetchPrimaryUrl = integration.primaryDomainUrl == null || shouldRefreshToken;

				// Skip if nothing needs updating
				if (!shouldRefreshToken && !shouldFetchPrimaryUrl) {
					continue;
				}

				// Check if this shop exists as a workspace account
				const [workspaceAccount] = await db
					.select({
						providerAccountId: workspaceAccountTable.providerAccountId
					})
					.from(workspaceAccountTable)
					.where(
						and(
							eq(workspaceAccountTable.workspaceId, workspaceId),
							eq(workspaceAccountTable.provider, 'shopify'),
							eq(workspaceAccountTable.providerAccountId, integration.shopId)
						)
					)
					.limit(1);
				if (workspaceAccount == null) {
					continue;
				}

				// Get offline token if needed
				const needsOfflineToken = shouldRefreshToken || shouldFetchPrimaryUrl;
				const offlineToken = needsOfflineToken
					? unwrapOrUndefined(await getShopifyOfflineAccessToken(integration.shopId))
					: null;

				// Refresh storefront access token if needed
				if (shouldRefreshToken && offlineToken != null) {
					const [isStorefrontAccessTokenOk, , storefrontAccessToken] =
						await getWorkspaceStorefrontAccessToken(workspaceId, {
							accessToken: offlineToken,
							shopId: integration.shopId
						});
					if (isStorefrontAccessTokenOk) {
						// Update token and set next refresh date
						if (integration.storefrontAccessToken !== storefrontAccessToken) {
							integration.storefrontAccessToken = storefrontAccessToken;
							updatedIntegrationIds.push(integrationId as TIntegrationId);
						}
						integration.storefrontAccessTokenRefreshAt = new Date(
							Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
						).toISOString();
					}
				}

				// Fetch and update primary domain URL if needed
				if (shouldFetchPrimaryUrl && offlineToken != null) {
					const primaryUrlResult = unwrapOrUndefined(
						await getShopPrimaryUrl({
							shopId: integration.shopId,
							accessToken: offlineToken
						})
					);
					if (primaryUrlResult != null) {
						const newPrimaryDomainUrl = primaryUrlResult.primaryDomain?.url;
						if (integration.primaryDomainUrl !== newPrimaryDomainUrl) {
							integration.primaryDomainUrl = newPrimaryDomainUrl;
							updatedIntegrationIds.push(integrationId as TIntegrationId);
						}
					}
				}
				break;
			}
			default:
			// do nothing
		}
	}

	return {
		integrations: updatedIntegrations,
		updatedIntegrationIds
	};
}

export interface TRefreshIntegrationsConfig {
	workspaceId: string;
	integrations: Record<string, TIntegration>;
}

export interface TRefreshIntegrationsResult {
	integrations: Record<TIntegrationId, TIntegration>;
	updatedIntegrationIds: TIntegrationId[];
}
