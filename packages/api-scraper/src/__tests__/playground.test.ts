import { describe, expect, it } from 'vitest';
import { fetchXUser } from '../lib';

describe('playground', () => {
	it('should fetch X user profile', { timeout: 0 }, async () => {
		const result = await fetchXUser('bennobuilder');
		console.log(result);
		expect(result).not.toBeNull();
	});
});
