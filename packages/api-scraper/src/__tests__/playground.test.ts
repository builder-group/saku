import { describe, expect, it } from 'vitest';
import { fetchClient } from '../environment/clients/api-client';

describe('playground', () => {
	it('should work with proxied client', { timeout: 0 }, async () => {
		const result = await fetchClient.proxyGet(
			'https://i.instagram.com/api/v1/users/web_profile_info',
			{
				queryParams: {
					username: 'harley'
				},
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'x-ig-app-id': '936619743392459'
				}
			}
		);
		if (!result.isOk()) {
			console.error('❌ Request failed:', {
				error: result.error,
				code: result.error.code,
				message: result.error instanceof Error ? result.error.message : String(result.error)
			});
		}
		expect(result.isOk()).toBe(true);
		if (result.isOk()) {
			expect(result.value.data).toBeDefined();
		}
	});
});
