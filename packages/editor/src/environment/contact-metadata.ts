import { TEmailAction, TLinkAction, TPhoneAction, TSocialAction } from '../types';

export const contactMetadataMap = {
	'email': {
		type: 'email' as const,
		label: 'Email',
		placeholder: 'your@email.com',
		getUrl: (email) => `mailto:${email}`,
		getAltText: (email) => (email != null ? `Email: ${email}` : 'Email')
	},
	'phone': {
		type: 'phone' as const,
		label: 'Phone',
		placeholder: '+1 (555) 123-4567',
		getUrl: (phone) => `tel:${phone}`,
		getAltText: (phone) => (phone != null ? `Phone: ${phone}` : 'Phone')
	},
	'link': {
		type: 'link' as const,
		label: 'Link',
		placeholder: 'https://example.com',
		getUrl: (url) => url,
		getAltText: (url) => (url != null ? `Link: ${url}` : 'Link')
	},
	'social.instagram': {
		type: 'social' as const,
		provider: 'instagram',
		label: 'Instagram',
		placeholder: 'username',
		getUrl: (handle) => `https://instagram.com/${handle}`,
		getAltText: (handle) => (handle != null ? `Instagram: @${handle}` : 'Instagram'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/+$/, '')
	},
	'social.x': {
		type: 'social' as const,
		provider: 'x',
		label: 'Twitter/X',
		placeholder: 'username',
		getUrl: (handle) => `https://twitter.com/${handle}`,
		getAltText: (handle) => (handle != null ? `Twitter/X: @${handle}` : 'Twitter/X'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '').replace(/\/+$/, '')
	},
	'social.youtube': {
		type: 'social' as const,
		provider: 'youtube',
		label: 'YouTube',
		placeholder: 'channelname',
		getUrl: (channel) => `https://youtube.com/@${channel}`,
		getAltText: (channel) => (channel != null ? `YouTube: @${channel}` : 'YouTube'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?youtube\.com\/(@|c\/)/, '').replace(/\/+$/, '')
	},
	'social.tiktok': {
		type: 'social' as const,
		provider: 'tiktok',
		label: 'TikTok',
		placeholder: 'username',
		getUrl: (handle) => `https://tiktok.com/@${handle}`,
		getAltText: (handle) => (handle != null ? `TikTok: @${handle}` : 'TikTok'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?tiktok\.com\/@/, '').replace(/\/+$/, '')
	},
	'social.linkedin': {
		type: 'social' as const,
		provider: 'linkedin',
		label: 'LinkedIn',
		placeholder: 'username',
		getUrl: (handle) => `https://linkedin.com/in/${handle}`,
		getAltText: (handle) => (handle != null ? `LinkedIn: ${handle}` : 'LinkedIn'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/+$/, '')
	},
	'social.facebook': {
		type: 'social' as const,
		provider: 'facebook',
		label: 'Facebook',
		placeholder: 'username',
		getUrl: (handle) => `https://facebook.com/${handle}`,
		getAltText: (handle) => (handle != null ? `Facebook: ${handle}` : 'Facebook'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/+$/, '')
	},
	'social.shopify': {
		type: 'social' as const,
		provider: 'shopify',
		label: 'Shopify',
		placeholder: 'store-name',
		getUrl: (handle) => {
			const cleanHandle = handle.replace(/^https?:\/\//, '');

			// If it's a myshopify domain, extract store name and construct URL
			if (cleanHandle.includes('.myshopify.com')) {
				const storeName = cleanHandle.replace('.myshopify.com', '');
				return `https://${storeName}.myshopify.com`;
			}

			// For custom domains, use as-is
			return `https://${cleanHandle}`;
		},
		getAltText: (handle) => (handle != null ? `Shopify: ${handle}` : 'Shopify'),
		getHandle: (url) => {
			const cleanUrl = url.replace(/^https?:\/\//, '');

			// If it's a myshopify domain, extract store name
			if (cleanUrl.includes('.myshopify.com')) {
				return cleanUrl.replace('.myshopify.com', '').replace(/\/+$/, '');
			}

			// For custom domains, return as-is
			return cleanUrl.replace(/\/+$/, '');
		}
	},
	'social.bluesky': {
		type: 'social' as const,
		provider: 'bluesky',
		label: 'Bluesky',
		placeholder: 'handle.bsky.social',
		getUrl: (handle) => `https://bsky.app/profile/${handle}`,
		getAltText: (handle) => (handle != null ? `Bluesky: @${handle}` : 'Bluesky'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?bsky\.app\/profile\//, '').replace(/\/+$/, '')
	},
	'social.discord': {
		type: 'social' as const,
		provider: 'discord',
		label: 'Discord',
		placeholder: 'user-id',
		getUrl: (userId) => `https://discord.com/users/${userId}`,
		getAltText: (userId) => (userId != null ? `Discord: ${userId}` : 'Discord'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?discord\.com\/users\//, '').replace(/\/+$/, '')
	},
	'social.github': {
		type: 'social' as const,
		provider: 'github',
		label: 'GitHub',
		placeholder: 'username',
		getUrl: (handle) => `https://github.com/${handle}`,
		getAltText: (handle) => (handle != null ? `GitHub: @${handle}` : 'GitHub'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/+$/, '')
	},
	'social.google': {
		type: 'social' as const,
		provider: 'google',
		label: 'Google',
		placeholder: 'username',
		getUrl: (handle) => `https://google.com/+${handle}`,
		getAltText: (handle) => (handle != null ? `Google+: ${handle}` : 'Google+'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?google\.com\/+/, '').replace(/\/+$/, '')
	},
	'social.spotify': {
		type: 'social' as const,
		provider: 'spotify',
		label: 'Spotify',
		placeholder: 'username',
		getUrl: (handle) => `https://open.spotify.com/user/${handle}`,
		getAltText: (handle) => (handle != null ? `Spotify: ${handle}` : 'Spotify'),
		getHandle: (url) =>
			url.replace(/^https?:\/\/(www\.)?open\.spotify\.com\/user\//, '').replace(/\/+$/, '')
	},
	'social.pinterest': {
		type: 'social' as const,
		provider: 'pinterest',
		label: 'Pinterest',
		placeholder: 'username',
		getUrl: (handle) => `https://pinterest.com/${handle}`,
		getAltText: (handle) => (handle != null ? `Pinterest: ${handle}` : 'Pinterest'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?pinterest\.com\//, '').replace(/\/+$/, '')
	},
	'social.patreon': {
		type: 'social' as const,
		provider: 'patreon',
		label: 'Patreon',
		placeholder: 'username',
		getUrl: (handle) => `https://patreon.com/${handle}`,
		getAltText: (handle) => (handle != null ? `Patreon: ${handle}` : 'Patreon'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?patreon\.com\//, '').replace(/\/+$/, '')
	}
} as const satisfies Record<string, TContactMetadata>;

export type TContactMetadata =
	| TLinkContactMetadata
	| TEmailContactMetadata
	| TPhoneContactMetadata
	| TSocialContactMetadata;

export interface TLinkContactMetadata {
	type: 'link';
	label: string;
	placeholder: string;
	getUrl: (url: string) => string;
	getAltText: (url?: string) => string;
}

export interface TEmailContactMetadata {
	type: 'email';
	label: string;
	placeholder: string;
	getUrl: (email: string) => string;
	getAltText: (email?: string) => string;
}

export interface TPhoneContactMetadata {
	type: 'phone';
	label: string;
	placeholder: string;
	getUrl: (phone: string) => string;
	getAltText: (phone?: string) => string;
}

export interface TSocialContactMetadata {
	type: 'social';
	provider: TSocialAction['provider'];
	label: string;
	placeholder: string;
	getUrl: (handle: string) => string;
	getAltText: (handle?: string) => string;
	getHandle: (url: string) => string;
}

export function getContactKey(
	action: TLinkAction | TEmailAction | TPhoneAction | TSocialAction
): keyof typeof contactMetadataMap {
	switch (action.type) {
		case 'social':
			return `social.${action.provider}`;
		default:
			return action.type;
	}
}

export function getSocialContactMetadata(platform: string): TSocialContactMetadata | null {
	switch (platform.toLowerCase()) {
		case 'twitter':
		case 'x':
			return contactMetadataMap['social.x'];
		case 'shopify':
		case 'shop':
			return contactMetadataMap['social.shopify'];
		default:
			return (
				(contactMetadataMap[
					`social.${platform}` as keyof typeof contactMetadataMap
				] as TSocialContactMetadata) ?? null
			);
	}
}
