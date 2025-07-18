import { Err, extractErrorData, Ok, type TResult } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import type { Context } from 'hono';
import { jwtVerify, type JWTPayload } from 'jose';
import { shopifyConfig } from '@/environment';

export async function verifyShopifySession(
	c: Context
): Promise<TResult<TShopifySessionPayload, AppError>> {
	const authHeader = c.req.header('authorization');

	if (authHeader == null) {
		return Err(
			new AppError('#ERR_MISSING_AUTH_HEADER', 401, {
				detail: 'Missing authorization header'
			})
		);
	}

	if (!authHeader.startsWith('Bearer ')) {
		return Err(
			new AppError('#ERR_INVALID_AUTH_FORMAT', 401, {
				detail: 'Authorization header must use Bearer token format'
			})
		);
	}

	const token = authHeader.substring(7); // Remove "Bearer " prefix

	return verifyShopifySessionToken(token);
}

export async function verifyShopifySessionToken(
	token: string
): Promise<TResult<TShopifySessionPayload, AppError>> {
	// Verify the JWT
	let payload: JWTPayload;
	try {
		const result = await jwtVerify(token, new TextEncoder().encode(shopifyConfig.apiSecret));
		payload = result.payload;
	} catch (error) {
		const { message } = extractErrorData(error);
		return Err(
			new AppError('#ERR_JWT_VERIFICATION_FAILED', 401, {
				detail: `JWT verification failed: ${message}`
			})
		);
	}

	// Validate required claims exist
	if (
		typeof payload['iss'] !== 'string' ||
		typeof payload['dest'] !== 'string' ||
		typeof payload['aud'] !== 'string' ||
		typeof payload['sub'] !== 'string'
	) {
		return Err(
			new AppError('#ERR_INVALID_JWT_CLAIMS', 401, {
				detail: 'Missing required claims in JWT payload'
			})
		);
	}

	// Validate audience matches our app's client ID
	if (payload['aud'] !== shopifyConfig.apiKey) {
		return Err(
			new AppError('#ERR_JWT_AUDIENCE_MISMATCH', 401, {
				detail: 'JWT audience does not match app client ID'
			})
		);
	}

	return Ok({
		...payload,
		iss: payload['iss'] as string,
		dest: payload['dest'] as string,
		aud: payload['aud'] as string,
		sub: payload['sub'] as string,
		shopId: payload['dest'].replace('https://', '') as string,
		userId: payload['sub'] as string
	});
}

// https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens
export type TShopifySessionPayload = JWTPayload & {
	iss: string;
	dest: string;
	aud: string;
	sub: string;
	shopId: string;
	userId: string;
};
