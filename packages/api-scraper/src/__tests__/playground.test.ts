import { describe, expect, it } from 'vitest';
import { appConfig } from '../environment';
import { fetchClient, proxiedFetchClient } from '../fetch-client';

describe('playground', () => {
	it('should work with proxied client', { timeout: 0 }, async () => {
		const result = await proxiedFetchClient.get(
			'https://i.instagram.com/api/v1/users/web_profile_info',
			{
				queryParams: {
					username: 'harley'
				},
				headers: {
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

	it('should work with raw oxylabs request', { timeout: 0 }, async () => {
		const result = await fetchClient.post(
			'https://realtime.oxylabs.io/v1/queries',
			{
				source: 'google',
				url: 'https://www.google.com/search?q=site%3Ainstagram.com+%22linkpop.com'
			},
			{
				headers: {
					Authorization: `Basic ${Buffer.from(`${appConfig.username}:${appConfig.password}`).toString('base64')}`
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
