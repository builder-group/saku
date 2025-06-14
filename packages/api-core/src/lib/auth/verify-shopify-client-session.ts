import { extractErrorData } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { jwtVerify, type JWTPayload } from 'jose';
import { shopifyConfig } from '@/environment';

export async function verifyShopifyClientSession(token: string): Promise<TShopifyJWTPayload> {
	// Verify the JWT
	let payload: JWTPayload;
	try {
		const result = await jwtVerify(token, new TextEncoder().encode(shopifyConfig.apiSecret));
		payload = result.payload;
	} catch (error) {
		const { message } = extractErrorData(error);
		throw new AppError('#ERR_JWT_VERIFICATION_FAILED', 401, {
			detail: `JWT verification failed: ${message}`
		});
	}

	// Validate required claims exist
	if (
		typeof payload['iss'] !== 'string' ||
		typeof payload['dest'] !== 'string' ||
		typeof payload['aud'] !== 'string' ||
		typeof payload['sub'] !== 'string'
	) {
		throw new AppError('#ERR_INVALID_JWT_CLAIMS', 401, {
			detail: 'Missing required claims in JWT payload'
		});
	}

	// Validate issuer and destination match (same shop domain)
	const issuerShop = extractShopFromUrl(payload['iss'] as string);
	const destShop = extractShopFromUrl(payload['dest'] as string);
	if (issuerShop !== destShop) {
		throw new AppError('#ERR_JWT_SHOP_MISMATCH', 401, {
			detail: 'Issuer and destination shop domains do not match'
		});
	}

	// Validate audience matches our app's client ID
	if (payload['aud'] !== shopifyConfig.apiKey) {
		throw new AppError('#ERR_JWT_AUDIENCE_MISMATCH', 401, {
			detail: 'JWT audience does not match app client ID'
		});
	}

	return {
		...payload,
		iss: payload['iss'] as string,
		dest: payload['dest'] as string,
		aud: payload['aud'] as string,
		sub: payload['sub'] as string,
		shopId: destShop
	};
}

function extractShopFromUrl(url: string): string {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.hostname;
	} catch {
		return url;
	}
}

export type TShopifyJWTPayload = JWTPayload & {
	iss: string;
	dest: string;
	aud: string;
	sub: string;
	shopId: string;
};
