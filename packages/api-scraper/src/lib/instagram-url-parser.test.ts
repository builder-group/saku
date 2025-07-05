import { describe, expect, it } from 'vitest';
import { parseInstagramUrl } from './instagram-url-parser';

describe('parseInstagramUrl', () => {
	// Test valid URLs
	it('should parse reel URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/reel/abc123')).toEqual({
			type: 'reel',
			url: 'https://www.instagram.com/reel/abc123',
			account: 'reel',
			accountUrl: 'https://www.instagram.com/reel'
		});

		expect(parseInstagramUrl('https://www.instagram.com/username/reel/abc123')).toEqual({
			type: 'reel',
			url: 'https://www.instagram.com/username/reel/abc123',
			account: 'username',
			accountUrl: 'https://www.instagram.com/username'
		});
	});

	it('should parse post URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/p/xyz789')).toEqual({
			type: 'post',
			url: 'https://www.instagram.com/p/xyz789',
			postId: 'xyz789'
		});
	});

	it('should parse tv URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/tv/xyz789')).toEqual({
			type: 'tv',
			url: 'https://www.instagram.com/tv/xyz789',
			videoId: 'xyz789'
		});
	});

	it('should parse guide URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/username/guide/my-guide/123456')).toEqual({
			type: 'guide',
			url: 'https://www.instagram.com/username/guide/my-guide/123456',
			account: 'username',
			accountUrl: 'https://www.instagram.com/username',
			guideSlug: 'my-guide',
			guideId: '123456'
		});
	});

	it('should parse account URLs', () => {
		expect(parseInstagramUrl('https://www.instagram.com/username')).toEqual({
			type: 'account',
			url: 'https://www.instagram.com/username',
			account: 'username'
		});
	});

	// Test invalid URLs
	it('should return null for invalid URLs', () => {
		const invalidUrls = [
			'not-a-url',
			'https://example.com/something',
			'https://www.instagram.com',
			'https://www.instagram.com/p/',
			'https://www.instagram.com/tv/',
			'https://www.instagram.com/explore',
			'https://www.instagram.com/direct',
			'https://www.instagram.com/username/guide/my-guide' // incomplete guide URL
		];

		invalidUrls.forEach((url) => {
			expect(parseInstagramUrl(url)).toBeNull();
		});
	});
});
