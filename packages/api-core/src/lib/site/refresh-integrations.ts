import { TIntegration, TIntegrationId } from '@repo/editor';
import { and, eq } from 'drizzle-orm';
import { db, workspaceAccountTable } from '@/environment';
import { getShopifyOfflineAccessToken, getWorkspaceStorefrontAccessToken } from '@/lib';

export async function refreshIntegrations(
	config: TRefreshIntegrationsConfig
): Promise<TRefreshIntegrationsResult> {
	const { workspaceId, integrations } = config;

	const updatedIntegrations = { ...integrations };
	const updatedIntegrationIds: TIntegrationId[] = [];

	for (const [integrationId, integration] of Object.entries(updatedIntegrations)) {
		switch (integration.type) {
			case 'shopify': {
				// Skip if not time to refresh yet
				if (integration.storefrontAccessTokenRefreshAt != null) {
					const refreshAt = new Date(integration.storefrontAccessTokenRefreshAt).getTime();
					if (Date.now() < refreshAt) {
						continue;
					}
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

				// Get current storefront access token
				const offlineToken = (await getShopifyOfflineAccessToken(integration.shopId)).unwrap();
				const [isStorefrontAccessTokenOk, , storefrontAccessToken] =
					await getWorkspaceStorefrontAccessToken(workspaceId, {
						accessToken: offlineToken,
						shopId: integration.shopId
					});
				if (!isStorefrontAccessTokenOk) {
					continue;
				}

				// Update token and set next refresh date
				if (integration.storefrontAccessToken !== storefrontAccessToken) {
					integration.storefrontAccessToken = storefrontAccessToken;
					updatedIntegrationIds.push(integrationId as TIntegrationId);
				}
				integration.storefrontAccessTokenRefreshAt = new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
				).toISOString();
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
