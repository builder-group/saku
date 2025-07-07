import { describe, expect, it } from 'vitest';
import { parseXUrl } from './parse-x-url';

describe('parseXUrl', () => {
	it('should parse post URLs', () => {
		expect(parseXUrl('https://x.com/username/status/123456')).toEqual({
			type: 'post',
			url: 'https://x.com/username/status/123456',
			postId: '123456',
			username: 'username',
			userUrl: 'https://x.com/username'
		});

		// Should handle twitter.com domain
		expect(parseXUrl('https://twitter.com/username/status/123456')).toEqual({
			type: 'post',
			url: 'https://x.com/username/status/123456',
			postId: '123456',
			username: 'username',
			userUrl: 'https://x.com/username'
		});
	});

	it('should parse user URLs', () => {
		expect(parseXUrl('https://x.com/username')).toEqual({
			type: 'user',
			url: 'https://x.com/username',
			username: 'username'
		});

		// Should handle twitter.com domain
		expect(parseXUrl('https://twitter.com/username')).toEqual({
			type: 'user',
			url: 'https://x.com/username',
			username: 'username'
		});

		// Should handle URLs with trailing slash
		expect(parseXUrl('https://x.com/username/')).toEqual({
			type: 'user',
			url: 'https://x.com/username',
			username: 'username'
		});
	});

	it('should return null for invalid URLs', () => {
		const invalidUrls = [
			// Invalid URL format
			'not-a-url',
			// Wrong domains
			'https://example.com/something',
			'https://facebook.com/username',
			// Empty paths
			'https://x.com',
			'https://twitter.com',
			// Reserved paths as usernames
			'https://x.com/status',
			'https://x.com/search',
			'https://x.com/home',
			// Invalid status URLs
			'https://x.com/username/status',
			'https://x.com/username/status/',
			// Invalid path structure
			'https://x.com/username/not-status/123456'
		];

		invalidUrls.forEach((url) => {
			expect(parseXUrl(url)).toBeNull();
		});
	});

	it('should handle usernames with special characters', () => {
		expect(parseXUrl('https://x.com/user_name')).toEqual({
			type: 'user',
			url: 'https://x.com/user_name',
			username: 'user_name'
		});

		expect(parseXUrl('https://x.com/user_name/status/123456')).toEqual({
			type: 'post',
			url: 'https://x.com/user_name/status/123456',
			postId: '123456',
			username: 'user_name',
			userUrl: 'https://x.com/user_name'
		});
	});
});
