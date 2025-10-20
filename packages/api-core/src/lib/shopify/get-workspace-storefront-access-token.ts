import { AppError } from '@repo/hono-utils';
import { and, eq, sql } from 'drizzle-orm';
import { Err, Ok, type TResult } from 'tuple-result';
import { db, logger, workspaceTokenTable } from '@/environment';
import { getOrCreateStorefrontAccessToken } from './get-or-create-storefront-access-token';

/**
 * Get or create a storefront access token for a workspace.
 */
export async function getWorkspaceStorefrontAccessToken(
	workspaceId: string,
	config: TGetWorkspaceStorefrontAccessTokenConfig
): Promise<TResult<string, AppError>> {
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
		return Ok(existingToken.accessToken);
	}

	// Create a new storefront access token (reusing existing if possible)
	const tokenResult = await getOrCreateStorefrontAccessToken(
		{
			title: `Storefront Token for ${displayName ?? shopId}`
		},
		{
			shopId,
			accessToken
		}
	);
	if (tokenResult.isErr()) {
		logger.error('Failed to create storefront token', {
			workspaceId,
			shopId,
			displayName,
			error: tokenResult.error
		});
		return Err(
			new AppError('#ERR_TOKEN_CREATE_FAILED', 500, {
				title: 'Failed to create storefront token',
				detail: 'Could not create storefront access token for the workspace'
			})
		);
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
		return Err(
			new AppError('#ERR_TOKEN_STORE_FAILED', 500, {
				title: 'Failed to store token',
				detail: 'Could not store storefront access token in database'
			})
		);
	}

	return Ok(storedToken.accessToken);
}

export type TGetWorkspaceStorefrontAccessTokenConfig = {
	accessToken: string;
	shopId: string;
	displayName?: string;
};
