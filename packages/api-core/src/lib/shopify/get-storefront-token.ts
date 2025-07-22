import { AppError } from '@repo/hono-utils';
import { and, eq, sql } from 'drizzle-orm';
import { db, workspaceTokenTable } from '@/environment';
import { createStorefrontAccessToken } from '@/lib';

/**
 * Get or create a storefront access token for a workspace.
 */
export async function getStorefrontToken(
	workspaceId: string,
	config: TGetStorefrontTokenConfig
): Promise<string> {
	const { accessToken, shopId, displayName } = config;

	// First, try to find an existing active token
	const [existingToken] = await db
		.select({
			accessToken: sql<string>`${workspaceTokenTable.tokenData}->>'accessToken'`
		})
		.from(workspaceTokenTable)
		.where(
			and(
				eq(workspaceTokenTable.workspaceId, workspaceId),
				eq(workspaceTokenTable.provider, 'shopify'),
				eq(workspaceTokenTable.tokenType, 'storefront')
			)
		)
		.limit(1);
	if (existingToken != null) {
		return existingToken.accessToken;
	}

	// Create a new storefront access token
	const tokenResult = await createStorefrontAccessToken(
		{
			title: `Storefront Token for ${displayName ?? shopId}`
		},
		{
			shopId,
			accessToken
		}
	);
	if (tokenResult.isErr()) {
		throw new AppError('#ERR_TOKEN_CREATE_FAILED', 500, {
			title: 'Failed to create storefront token',
			detail: 'Could not create storefront access token for the workspace'
		});
	}

	// Store the new token in database
	const [storedToken] = await db
		.insert(workspaceTokenTable)
		.values({
			workspaceId,
			provider: 'shopify',
			providerTokenId: tokenResult.value.id,
			tokenType: 'storefront',
			tokenData: {
				title: tokenResult.value.title,
				accessToken: tokenResult.value.accessToken,
				accessScopes: tokenResult.value.accessScopes
			},
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.returning({
			accessToken: sql<string>`${workspaceTokenTable.tokenData}->>'accessToken'`
		});
	if (storedToken == null) {
		throw new AppError('#ERR_TOKEN_STORE_FAILED', 500, {
			title: 'Failed to store token',
			detail: 'Could not store storefront access token in database'
		});
	}

	return storedToken.accessToken;
}

export type TGetStorefrontTokenConfig = {
	accessToken: string;
	shopId: string;
	displayName?: string;
};
