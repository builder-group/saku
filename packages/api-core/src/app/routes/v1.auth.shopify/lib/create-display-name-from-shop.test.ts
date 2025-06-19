import { describe, expect, it } from 'vitest';
import { createDisplayNameFromShop } from './create-display-name-from-shop';

describe('createDisplayNameFromShop function', () => {
	it('converts basic shop domain to display name', () => {
		const displayName = createDisplayNameFromShop('coffee-shop.myshopify.com');
		expect(displayName).toBe('Coffee Shop');
	});

	it('handles multiple word separators', () => {
		const displayName = createDisplayNameFromShop('builder-group-dev-store.myshopify.com');
		expect(displayName).toBe('Builder Group Dev Store');
	});

	it('handles single word shop names', () => {
		const displayName = createDisplayNameFromShop('coffeeshop.myshopify.com');
		expect(displayName).toBe('Coffeeshop');
	});

	it('handles numbers in shop name', () => {
		const displayName = createDisplayNameFromShop('coffee-shop-123.myshopify.com');
		expect(displayName).toBe('Coffee Shop 123');
	});

	it('handles uppercase in shop name', () => {
		const displayName = createDisplayNameFromShop('CoffeeShop-TEST.myshopify.com');
		expect(displayName).toBe('CoffeeShop TEST');
	});

	it('handles shop name without myshopify domain', () => {
		const displayName = createDisplayNameFromShop('coffee-shop');
		expect(displayName).toBe('Coffee Shop');
	});
});
