import { AppError } from '@repo/hono-utils';
import { Ok, TResult } from 'tuple-result';
import {
	createStorefrontAccessToken,
	getStorefrontAccessTokens,
	TStorefrontAccessTokenCreateInput,
	TStorefrontAccessTokenCreateSuccess
} from '../gql';

/**
 * Get or create a storefront access token, reusing existing tokens when possible.
 *
 * This function tries to reuse existing tokens with matching title
 * to avoid hitting the 100 token limit.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/latest/objects/StorefrontAccessToken
 */
export async function getOrCreateStorefrontAccessToken(
	input: TStorefrontAccessTokenCreateInput,
	config: TGetOrCreateStorefrontAccessTokenConfig
): Promise<TResult<TStorefrontAccessTokenCreateSuccess, AppError>> {
	const { shopId, accessToken } = config;

	// First, try to find an existing token with matching title
	const [isExistingTokensOk, , existingTokens] = await getStorefrontAccessTokens(
		{ first: 100 }, // Get all tokens to check for matches
		{ shopId, accessToken }
	);

	if (isExistingTokensOk) {
		const matchingToken = existingTokens.tokens.find((token) => {
			// Note: We only match by title since access scopes are inherited from app config
			// and are the same for all tokens created by this app
			return token.title === input.title;
		});
		if (matchingToken != null) {
			return Ok({
				id: matchingToken.id,
				accessToken: matchingToken.accessToken,
				title: matchingToken.title,
				accessScopes: matchingToken.accessScopes,
				createdAt: matchingToken.createdAt
			});
		}
	}

	// No matching token found, create a new one
	return await createStorefrontAccessToken(input, config);
}

export interface TGetOrCreateStorefrontAccessTokenConfig {
	shopId: string;
	accessToken: string;
}
