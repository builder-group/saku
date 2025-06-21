// Based on:
// https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-app-remix/src/server/authenticate/helpers/get-session-token-header.ts

export function getSessionTokenFromHeader(request: Request): string | undefined {
	return request.headers.get('authorization')?.replace('Bearer ', '');
}

export function getSessionTokenFromUrlParam(request: Request): string | null {
	const url = new URL(request.url);

	return url.searchParams.get('id_token');
}

export function getSessionTokenFromRequest(request: Request): string | null {
	return getSessionTokenFromHeader(request) ?? getSessionTokenFromUrlParam(request);
}
