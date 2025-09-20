import { describe, expect, it } from 'vitest';
import { appConfig } from './environment';
import { sendColdOutreachEmail } from './lib';

describe('Cold Outreach', () => {
	it('should have environment variables loaded', () => {
		expect(process.env['NODE_ENV']).toBeDefined();
		expect(process.env['NODE_ENV']).toBe('test');

		expect(appConfig.email.domain).toBeDefined();
		expect(appConfig.email.from).toBeDefined();
		expect(appConfig.resend.apiKey).toBeDefined();

		console.log('✓ Environment variables loaded successfully');
	});

	it('should send a cold outreach email', async () => {
		const result = await sendColdOutreachEmail({
			email: 'benno@builder.group',
			name: 'Kristi',
			handle: 'kristi.brocato',
			videoId: 'em9wkqys0ghk8ma'
		});
		expect(result.isOk()).toBe(true);
	});
});
