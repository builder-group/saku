import { TIntegration, TIntegrationId } from '@repo/editor';
import { and, eq, sql } from 'drizzle-orm';
import { db, siteTable, workspaceAccountTable } from '@/environment';
import { getShopifyOfflineAccessToken, getStorefrontToken } from '@/lib';

export async function refreshIntegrations(
	config: TRefreshIntegrationsConfig
): Promise<TRefreshIntegrationsResult> {
	const { siteId, workspaceId, integrations } = config;

	const updatedIntegrations = { ...integrations };
	const updatedIntegrationIds: TIntegrationId[] = [];

	for (const [integrationId, integration] of Object.entries(updatedIntegrations)) {
		switch (integration.type) {
			case 'shopify': {
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

				// Get offline access token for this shop
				const offlineToken = (await getShopifyOfflineAccessToken(integration.shopId)).unwrap();

				// Get fresh storefront access token
				const storefrontTokenResult = await getStorefrontToken(workspaceId, {
					accessToken: offlineToken,
					shopId: integration.shopId
				});
				if (storefrontTokenResult.isErr()) {
					continue;
				}
				const freshToken = storefrontTokenResult.value;

				// Check if token changed
				if (integration.storefrontAccessToken !== freshToken) {
					integration.storefrontAccessToken = freshToken;
					updatedIntegrationIds.push(integrationId as TIntegrationId);
				}
				break;
			}
			default:
			// do nothing
		}
	}

	// Update DB for changed integrations
	for (const integrationId of updatedIntegrationIds) {
		const integration = updatedIntegrations[integrationId] as TIntegration;

		await db
			.update(siteTable)
			.set({
				content: sql.raw(
					`jsonb_set(content, '{integrations,"${integrationId}"}', '${JSON.stringify(integration)}'::jsonb, true)`
				),
				updatedAt: new Date()
			})
			.where(eq(siteTable.id, siteId));
	}

	return {
		integrations: updatedIntegrations,
		updatedIntegrationIds
	};
}

export interface TRefreshIntegrationsConfig {
	siteId: string;
	workspaceId: string;
	integrations: Record<string, TIntegration>;
}

export interface TRefreshIntegrationsResult {
	integrations: Record<TIntegrationId, TIntegration>;
	updatedIntegrationIds: TIntegrationId[];
}
