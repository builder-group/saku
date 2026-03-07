import { describe, expect, it } from 'vitest';
import { contactMetadataMap, getContactKey, getSocialContactMetadata } from './contact-metadata';

describe('contactMetadataMap', () => {
	describe('email', () => {
		describe('getUrl', () => {
			it('returns a mailto URL', () => {
				expect(contactMetadataMap.email.getUrl('test@example.com')).toBe('mailto:test@example.com');
			});
		});

		describe('getAltText', () => {
			it('returns a descriptive alt text', () => {
				expect(contactMetadataMap.email.getAltText('test@example.com')).toBe(
					'Email: test@example.com'
				);
			});
		});
	});

	describe('phone', () => {
		describe('getUrl', () => {
			it('returns a tel URL', () => {
				expect(contactMetadataMap.phone.getUrl('+1 (555) 123-4567')).toBe('tel:+1 (555) 123-4567');
			});
		});

		describe('getAltText', () => {
			it('returns a descriptive alt text', () => {
				expect(contactMetadataMap.phone.getAltText('+1 (555) 123-4567')).toBe(
					'Phone: +1 (555) 123-4567'
				);
			});
		});
	});

	describe('social.getUrl', () => {
		const cases = [
			['social.instagram', 'testuser', 'https://instagram.com/testuser'],
			['social.x', 'testuser', 'https://twitter.com/testuser'],
			['social.youtube', 'testchannel', 'https://youtube.com/@testchannel'],
			['social.tiktok', 'testuser', 'https://tiktok.com/@testuser'],
			['social.linkedin', 'testuser', 'https://linkedin.com/in/testuser'],
			['social.facebook', 'testuser', 'https://facebook.com/testuser'],
			['social.whatsapp', '5511999999999', 'https://wa.me/5511999999999'],
			['social.shopify', 'example', 'https://example'],
			['social.bluesky', 'testuser.bsky.social', 'https://bsky.app/profile/testuser.bsky.social'],
			['social.discord', '123456', 'https://discord.com/users/123456'],
			['social.github', 'testuser', 'https://github.com/testuser'],
			['social.google', 'testuser', 'https://google.com/+testuser'],
			['social.spotify', 'testuser', 'https://open.spotify.com/user/testuser'],
			['social.pinterest', 'testuser', 'https://pinterest.com/testuser'],
			['social.patreon', 'testuser', 'https://patreon.com/testuser']
		] as const;

		it.each(cases)('returns URL for %s', (key, handle, expectedUrl) => {
			expect(contactMetadataMap[key].getUrl(handle)).toBe(expectedUrl);
		});
	});

	describe('social.getAltText', () => {
		const cases = [
			['social.instagram', 'testuser', 'Instagram: @testuser'],
			['social.x', 'testuser', 'Twitter/X: @testuser'],
			['social.youtube', 'testchannel', 'YouTube: @testchannel'],
			['social.tiktok', 'testuser', 'TikTok: @testuser'],
			['social.linkedin', 'testuser', 'LinkedIn: testuser'],
			['social.facebook', 'testuser', 'Facebook: testuser'],
			['social.whatsapp', '5511999999999', 'WhatsApp: 5511999999999'],
			['social.shopify', 'example', 'Shopify: example'],
			['social.bluesky', 'testuser.bsky.social', 'Bluesky: @testuser.bsky.social'],
			['social.discord', '123456', 'Discord: 123456'],
			['social.github', 'testuser', 'GitHub: @testuser'],
			['social.google', 'testuser', 'Google+: testuser'],
			['social.spotify', 'testuser', 'Spotify: testuser'],
			['social.pinterest', 'testuser', 'Pinterest: testuser'],
			['social.patreon', 'testuser', 'Patreon: testuser']
		] as const;

		it.each(cases)('returns alt text for %s', (key, handle, expectedAltText) => {
			expect(contactMetadataMap[key].getAltText(handle)).toBe(expectedAltText);
		});
	});

	describe('social.getHandle', () => {
		const cases = [
			['social.instagram', 'https://instagram.com/testuser/', 'testuser'],
			[
				'social.instagram',
				'https://instagram.com/testuser?utm_source=ig',
				'https://instagram.com/testuser?utm_source=ig'
			],
			['social.x', 'https://x.com/testuser/', 'testuser'],
			['social.x', 'https://x.com/testuser?ref_src=twsrc', 'https://x.com/testuser?ref_src=twsrc'],
			['social.youtube', 'https://youtube.com/@testchannel/', 'testchannel'],
			[
				'social.youtube',
				'https://youtube.com/@testchannel?si=abc',
				'https://youtube.com/@testchannel?si=abc'
			],
			['social.tiktok', 'https://tiktok.com/@testuser/', 'testuser'],
			[
				'social.tiktok',
				'https://tiktok.com/@testuser?lang=en',
				'https://tiktok.com/@testuser?lang=en'
			],
			['social.linkedin', 'https://linkedin.com/in/testuser/', 'testuser'],
			[
				'social.linkedin',
				'https://linkedin.com/in/testuser?trk=profile',
				'https://linkedin.com/in/testuser?trk=profile'
			],
			['social.facebook', 'https://facebook.com/testuser/', 'testuser'],
			[
				'social.facebook',
				'https://facebook.com/testuser?mibextid=ZbWKwL',
				'https://facebook.com/testuser?mibextid=ZbWKwL'
			],
			['social.whatsapp', 'https://wa.me/5511999999999', '5511999999999'],
			[
				'social.whatsapp',
				'https://wa.me/5511999999999?text=hi',
				'https://wa.me/5511999999999?text=hi'
			],
			[
				'social.whatsapp',
				'https://api.whatsapp.com/send/?phone=5511999999999&text=hi',
				'https://api.whatsapp.com/send/?phone=5511999999999&text=hi'
			],
			[
				'social.whatsapp',
				'https://chat.whatsapp.com/invite/example',
				'https://chat.whatsapp.com/invite/example'
			],
			['social.shopify', 'https://example.myshopify.com/', 'example'],
			['social.shopify', 'https://store.example.com/', 'store.example.com'],
			['social.bluesky', 'https://bsky.app/profile/testuser.bsky.social/', 'testuser.bsky.social'],
			[
				'social.bluesky',
				'https://bsky.app/profile/testuser.bsky.social?ref=home',
				'https://bsky.app/profile/testuser.bsky.social?ref=home'
			],
			['social.discord', 'https://discord.com/users/123456/', '123456'],
			[
				'social.discord',
				'https://discord.com/users/123456?ref=app',
				'https://discord.com/users/123456?ref=app'
			],
			['social.github', 'https://github.com/testuser/', 'testuser'],
			[
				'social.github',
				'https://github.com/testuser?tab=repositories',
				'https://github.com/testuser?tab=repositories'
			],
			['social.google', 'https://google.com/+testuser/', '+testuser'],
			['social.google', 'https://google.com/+testuser?hl=en', 'https://google.com/+testuser?hl=en'],
			['social.spotify', 'https://open.spotify.com/user/testuser/', 'testuser'],
			[
				'social.spotify',
				'https://open.spotify.com/user/testuser?si=abc',
				'https://open.spotify.com/user/testuser?si=abc'
			],
			['social.pinterest', 'https://pinterest.com/testuser/', 'testuser'],
			[
				'social.pinterest',
				'https://pinterest.com/testuser?invite_code=123',
				'https://pinterest.com/testuser?invite_code=123'
			],
			['social.patreon', 'https://patreon.com/testuser/', 'testuser'],
			[
				'social.patreon',
				'https://patreon.com/testuser?view_as=public',
				'https://patreon.com/testuser?view_as=public'
			]
		] as const;

		it.each(cases)('returns expected value for %s -> %s', (key, url, expectedHandle) => {
			expect(contactMetadataMap[key].getHandle(url)).toBe(expectedHandle);
		});
	});
});

describe('getContactKey', () => {
	it('should return social provider key for social action', () => {
		expect(
			getContactKey({
				type: 'social',
				provider: 'whatsapp',
				handle: '5511999999999'
			})
		).toBe('social.whatsapp');
	});
});

describe('getSocialContactMetadata', () => {
	it('should resolve Twitter alias to social.x metadata', () => {
		expect(getSocialContactMetadata('twitter')).toBe(contactMetadataMap['social.x']);
	});

	it('should resolve platform names directly', () => {
		expect(getSocialContactMetadata('whatsapp')).toBe(contactMetadataMap['social.whatsapp']);
	});

	it('should return null for unknown platforms', () => {
		expect(getSocialContactMetadata('unknown-platform')).toBe(null);
	});
});
