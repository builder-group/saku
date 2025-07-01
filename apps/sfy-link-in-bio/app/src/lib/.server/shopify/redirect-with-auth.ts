import { redirect } from '@remix-run/node';

/**
 * Creates a redirect response that preserves Shopify authentication parameters.
 * Use this instead of Remix's redirect() when redirecting on the server side
 * to maintain the Shopify embedded app context.
 */
export function redirectWithAuth(request: Request, to: string) {
	const url = new URL(request.url);
	const targetUrl = new URL(to, url.origin);
	url.searchParams.forEach((value, key) => {
		targetUrl.searchParams.set(key, value);
	});

	return redirect(targetUrl.pathname + targetUrl.search);
}
