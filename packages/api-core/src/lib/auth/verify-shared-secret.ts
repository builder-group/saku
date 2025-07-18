import { Err, Ok, type TResult } from '@blgc/utils';
import { AppError, safeCompare } from '@repo/hono-utils';
import type { Context } from 'hono';

// TODO: Use HMAC signature instead of sending plain text secret
export async function verifySharedSecret(
	c: Context,
	secret: string
): Promise<TResult<void, AppError>> {
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

	if (!safeCompare(token, secret)) {
		return Err(
			new AppError('#ERR_INVALID_SECRET', 401, {
				detail: 'Invalid shared secret'
			})
		);
	}

	return Ok(undefined);
}
