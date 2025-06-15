import { describe, expect, it } from 'vitest';
import { createHandleFromEmail } from './create-handle-from-email';

describe('createHandleFromEmail function', () => {
	it('creates a handle with local part and 4-char discriminator', () => {
		const handle = createHandleFromEmail('bennodev@gmail.com');
		expect(handle).toBe('bennodevc140f150');
	});

	it('removes all special characters including dots', () => {
		const handle = createHandleFromEmail('john.doe+123@example.com');
		expect(handle).toBe('johndoe1233337b5cc');
	});
});
