import { describe, expect, it } from 'vitest';
import { appConfig } from '../environment/configs/app.config';
import { fetchXUser } from '../lib';

describe('playground', () => {
	it('should have environment variables loaded', () => {
		expect(process.env['NODE_ENV']).toBeDefined();
		expect(process.env['NODE_ENV']).toBe('test');

		expect(appConfig.oxyLabs.username).toBeDefined();
		expect(appConfig.oxyLabs.password).toBeDefined();
		expect(appConfig.x.bearerToken).toBeDefined();

		console.log('✓ Environment variables loaded successfully');
	});

	it('should fetch X user profile', { timeout: 0 }, async () => {
		const result = await fetchXUser('bennobuilder');
		console.log(result);
		expect(result).not.toBeNull();
	});
});
