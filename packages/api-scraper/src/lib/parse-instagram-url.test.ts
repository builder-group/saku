import { describe, expect, it } from 'vitest';
import { parseInstagramUrl } from './parse-instagram-url';

describe('parseInstagramUrl', () => {
	it('should parse post URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/p/xyz789')).toEqual({
			type: 'post',
			url: 'https://www.instagram.com/p/xyz789',
			postId: 'xyz789'
		});

		expect(parseInstagramUrl('https://instagram.com/p/xyz789')).toEqual({
			type: 'post',
			url: 'https://www.instagram.com/p/xyz789',
			postId: 'xyz789'
		});
	});

	it('should parse reel URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/reel/abc123')).toEqual({
			type: 'reel',
			url: 'https://www.instagram.com/reel/abc123',
			reelId: 'abc123'
		});

		// Should handle /reels/ format
		expect(parseInstagramUrl('https://www.instagram.com/reels/abc123')).toEqual({
			type: 'reel',
			url: 'https://www.instagram.com/reel/abc123',
			reelId: 'abc123'
		});
	});

	it('should parse user URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/username')).toEqual({
			type: 'user',
			url: 'https://www.instagram.com/username',
			username: 'username'
		});

		// Should handle different domains
		expect(parseInstagramUrl('https://instagram.com/username')).toEqual({
			type: 'user',
			url: 'https://www.instagram.com/username',
			username: 'username'
		});
	});

	it('should return null for invalid URLs', () => {
		const invalidUrls = [
			'not-a-url',
			'https://example.com/something',
			'https://www.instagram.com',
			'https://www.instagram.com/p/',
			'https://www.instagram.com/reel/',
			'https://www.instagram.com/reels/'
		];

		invalidUrls.forEach((url) => {
			expect(parseInstagramUrl(url)).toBeNull();
		});
	});
});
