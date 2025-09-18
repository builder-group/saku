import { describe, expect, it } from 'vitest';
import { parseShopifySessionId } from './parse-shopify-session-id';

describe('parseShopifySessionId function', () => {
	describe('offline sessions', () => {
		it('parses offline session with shop domain only', () => {
			const result = parseShopifySessionId('my-shop.myshopify.com');

			expect(result).toEqual({
				type: 'offline',
				shopDomain: 'my-shop.myshopify.com'
			});
		});

		it('parses offline session with custom domain', () => {
			const result = parseShopifySessionId('coffee-shop.myshopify.com');

			expect(result).toEqual({
				type: 'offline',
				shopDomain: 'coffee-shop.myshopify.com'
			});
		});
	});

	describe('online sessions', () => {
		it('parses online session with shop domain and user ID', () => {
			const result = parseShopifySessionId('my-shop.myshopify.com_987654321');

			expect(result).toEqual({
				type: 'online',
				shopDomain: 'my-shop.myshopify.com',
				userId: '987654321'
			});
		});

		it('parses online session with different user ID format', () => {
			const result = parseShopifySessionId('test-store.myshopify.com_123456789');

			expect(result).toEqual({
				type: 'online',
				shopDomain: 'test-store.myshopify.com',
				userId: '123456789'
			});
		});
	});

	it('returns null for empty string', () => {
		expect(parseShopifySessionId('')).toBe(null);
	});

	it('returns null for non-string input', () => {
		expect(parseShopifySessionId(null as any)).toBe(null);
		expect(parseShopifySessionId(undefined as any)).toBe(null);
		expect(parseShopifySessionId(123 as any)).toBe(null);
	});

	it('returns null for invalid online session format (empty shop domain)', () => {
		expect(parseShopifySessionId('_987654321')).toBe(null);
	});

	it('returns null for invalid online session format (empty user ID)', () => {
		expect(parseShopifySessionId('my-shop.myshopify.com_')).toBe(null);
	});

	it('returns null for too many parts', () => {
		expect(parseShopifySessionId('shop_user_extra')).toBe(null);
	});

	it('returns null for multiple underscores', () => {
		expect(parseShopifySessionId('shop_user_extra_more')).toBe(null);
	});
});
