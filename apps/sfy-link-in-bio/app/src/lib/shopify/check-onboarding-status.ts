import { Err, Ok, TResult } from 'tuple-result';
import { coreApiClient } from '@/environment';
import { AppError } from '@/lib/AppError';
import { createShopifyTokenMiddleware } from '@/lib/middleware';

export async function checkOnboardingStatus(
	sessionToken: string
): Promise<TResult<boolean, AppError>> {
	const workspaceResult = await coreApiClient.get('/v1/shopify/workspace', {
		requestMiddlewares: [createShopifyTokenMiddleware(sessionToken)]
	});
	if (workspaceResult.isErr()) {
		return Err(
			new AppError('#ERR_SERVER_ERROR', {
				detail: 'Failed to fetch workspace data',
				throwable: workspaceResult.error
			})
		);
	}

	return Ok(workspaceResult.value.data.onboardingCompletedAt != null);
}
