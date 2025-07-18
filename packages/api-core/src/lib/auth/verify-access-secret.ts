import { Context } from 'hono';
import { appConfig } from '@/environment';
import { verifyHmacSignature } from './verify-hmac-signature';

export function verifyAccessSecret(c: Context) {
	return verifyHmacSignature(c, {
		secret: appConfig.accessSecret
	});
}
