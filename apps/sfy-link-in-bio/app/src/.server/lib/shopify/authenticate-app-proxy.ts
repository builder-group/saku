import { createSHA256HMAC, HashFormat } from '@shopify/shopify-api/runtime';
import { Err, Ok, type TResult } from 'tuple-result';
import { shopify, shopifyConfig } from '@/.server/environment';
import { AppError } from '@/lib';

/**
 * Authenticates Shopify App Proxy request with optional fallback.
 *
 * @param request - The incoming request
 * @param options - Configuration options
 * @returns Authentication result with method and context/shop
 */
export async function authenticateAppProxy(
	request: Request,
	options: TAuthenticateAppProxyOptions = {}
): Promise<TAppProxyAuthResult> {
	const { enableFallback = false } = options;

	// Try official Shopify authentication first
	try {
		const context = await shopify.authenticate.public.appProxy(request);
		return { method: 'official', context };
	} catch (error) {
		// Continue to fallback if enabled
	}

	const url = new URL(request.url);
	const shop = url.searchParams.get('shop');
	if (shop == null) {
		return { method: 'invalid', error: 'No shop parameter found in request' };
	}

	// Try signature recalculation fallback
	// (handles authentication failures in production)
	// https://github.com/Shopify/shopify-app-js/issues/455
	// https://github.com/Shopify/shopify-app-js/issues/2374
	if (enableFallback) {
		const recalculationResult = await trySignatureRecalculation(request);
		if (recalculationResult.isOk()) {
			try {
				const context = await shopify.authenticate.public.appProxy(recalculationResult.value);
				return { method: 'fallback', context };
			} catch (error) {
				// Fallback failed, continue to unverified
			}
		}
	}

	return { method: 'unverified', shop, error: 'Signature validation failed' };
}

export type TAppProxyAuthResult =
	| { method: 'official'; context: TAppProxyContext }
	| { method: 'fallback'; context: TAppProxyContext }
	| { method: 'unverified'; shop: string; error: string }
	| { method: 'invalid'; error: string };

export type TAppProxyContext = Awaited<ReturnType<typeof shopify.authenticate.public.appProxy>>;

export interface TAuthenticateAppProxyOptions {
	enableFallback?: boolean;
}

/**
 * Tries to validate request with recalculated signature.
 * Handles timestamp differences and parameter encoding issues.
 */
async function trySignatureRecalculation(request: Request): Promise<TResult<Request, AppError>> {
	const url = new URL(request.url);
	const querystring = url.search;
	if (!querystring.length) {
		return Err(
			new AppError('#ERR_NO_QUERY_STRING', {
				detail: 'No query string found in URL'
			})
		);
	}

	// Recalculate signature with normalized params
	const signatureResult = await computeAppProxySignature(querystring);
	if (signatureResult.isErr()) {
		return Err(signatureResult.error);
	}

	// Create new URL with recalculated signature
	const correctedUrl = request.url.replace(
		/(&|\?)signature=[^&]*/,
		`$1signature=${signatureResult.value}`
	);

	return Ok(new Request(correctedUrl, request));
}

/**
 * Computes App Proxy signature following Shopify's specification.
 */
async function computeAppProxySignature(querystring: string): Promise<TResult<string, AppError>> {
	try {
		// Parse query params
		const searchParams = new URLSearchParams(
			querystring.includes('?') ? querystring.split('?')[1] : querystring
		);
		const params = Object.fromEntries(searchParams.entries());
		const { signature, ...paramsWithoutSignature } = params;

		// Build sorted query string for signature
		const sortedQueryString = Object.entries(paramsWithoutSignature)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => `${key}=${value}`)
			.join('');

		const hmacSignature = await createSHA256HMAC(
			shopifyConfig.apiSecret,
			sortedQueryString,
			HashFormat.Hex
		);

		return Ok(hmacSignature);
	} catch (error) {
		return Err(
			new AppError('#ERR_SIGNATURE_COMPUTATION', {
				detail: 'Failed to compute App Proxy signature',
				throwable: error instanceof Error ? error : undefined
			})
		);
	}
}
