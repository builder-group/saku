import { Context } from 'hono';
import { describe, expect, it } from 'vitest';
import { createOriginHandler } from './cors';

describe('createOriginHandler', () => {
	const c = null as unknown as Context;

	it('handles string origins', () => {
		const handler = createOriginHandler('https://example.com');
		expect(handler('https://example.com', c)).toBe('https://example.com');
		expect(handler('https://other.com', c)).toBe(null);
	});

	it('handles array of string origins', () => {
		const handler = createOriginHandler(['https://example.com', 'https://test.com']);
		expect(handler('https://example.com', c)).toBe('https://example.com');
		expect(handler('https://test.com', c)).toBe('https://test.com');
		expect(handler('https://other.com', c)).toBe(null);
	});

	it('handles domain matching', () => {
		const handler = createOriginHandler({ domain: 'https://example.com' });
		expect(handler('https://example.com', c)).toBe('https://example.com');
		expect(handler('https://other.com', c)).toBe(null);
	});

	it('handles TLD matching', () => {
		const handler = createOriginHandler({ domain: 'https://example.com', strategy: 'tld' });
		expect(handler('https://api.example.com', c)).toBe('https://api.example.com');
		expect(handler('https://other.com', c)).toBe(null);
	});

	it('handles mixed origin configs', () => {
		const handler = createOriginHandler([
			'https://exact-match.com',
			{ domain: 'https://example.com', strategy: 'tld' },
			{ domain: 'https://test.com' }
		]);
		expect(handler('https://exact-match.com', c)).toBe('https://exact-match.com');
		expect(handler('https://api.example.com', c)).toBe('https://api.example.com');
		expect(handler('https://test.com', c)).toBe('https://test.com');
		expect(handler('https://other.com', c)).toBe(null);
	});

	it('handles custom function', () => {
		const customHandler = (origin: string) => (origin.includes('example.com') ? origin : null);
		const handler = createOriginHandler(customHandler);
		expect(handler('https://example.com', c)).toBe('https://example.com');
		expect(handler('https://api.example.com', c)).toBe('https://api.example.com');
		expect(handler('https://other.com', c)).toBe(null);
	});
});
