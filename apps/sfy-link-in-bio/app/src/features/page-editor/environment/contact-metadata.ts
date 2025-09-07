import { TEmailAction, TPhoneAction, TSocialAction } from '@repo/editor';
import {
	BlueskyIcon,
	DiscordIcon,
	FacebookIcon,
	GithubIcon,
	GoogleIcon,
	InstagramIcon,
	LinkedInIcon,
	MailIcon,
	PhoneIcon,
	PinterestIcon,
	ShopifyIcon,
	SpotifyIcon,
	TikTokIcon,
	XTwitterIcon,
	YouTubeIcon
} from '@/components';

export const contactMetadataMap = {
	'email': {
		type: 'email' as const,
		label: 'Email',
		placeholder: 'your@email.com',
		getUrl: (email) => `mailto:${email}`,
		getTitle: (email) => (email != null ? `Email: ${email}` : 'Email')
	},
	'phone': {
		type: 'phone' as const,
		label: 'Phone',
		placeholder: '+1 (555) 123-4567',
		getUrl: (phone) => `tel:${phone}`,
		getTitle: (phone) => (phone != null ? `Phone: ${phone}` : 'Phone')
	},
	'social.instagram': {
		type: 'social' as const,
		provider: 'instagram',
		label: 'Instagram',
		placeholder: 'username',
		getUrl: (handle) => `https://instagram.com/${handle}`,
		getTitle: (handle) => (handle != null ? `Instagram: @${handle}` : 'Instagram'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
	},
	'social.x': {
		type: 'social' as const,
		provider: 'x',
		label: 'Twitter/X',
		placeholder: 'username',
		getUrl: (handle) => `https://twitter.com/${handle}`,
		getTitle: (handle) => (handle != null ? `Twitter/X: @${handle}` : 'Twitter/X'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '')
	},
	'social.youtube': {
		type: 'social' as const,
		provider: 'youtube',
		label: 'YouTube',
		placeholder: 'channelname',
		getUrl: (channel) => `https://youtube.com/@${channel}`,
		getTitle: (channel) => (channel != null ? `YouTube: @${channel}` : 'YouTube'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?youtube\.com\/(@|c\/)/, '')
	},
	'social.tiktok': {
		type: 'social' as const,
		provider: 'tiktok',
		label: 'TikTok',
		placeholder: 'username',
		getUrl: (handle) => `https://tiktok.com/@${handle}`,
		getTitle: (handle) => (handle != null ? `TikTok: @${handle}` : 'TikTok'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?tiktok\.com\/@/, '')
	},
	'social.linkedin': {
		type: 'social' as const,
		provider: 'linkedin',
		label: 'LinkedIn',
		placeholder: 'username',
		getUrl: (handle) => `https://linkedin.com/in/${handle}`,
		getTitle: (handle) => (handle != null ? `LinkedIn: ${handle}` : 'LinkedIn'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')
	},
	'social.facebook': {
		type: 'social' as const,
		provider: 'facebook',
		label: 'Facebook',
		placeholder: 'username',
		getUrl: (handle) => `https://facebook.com/${handle}`,
		getTitle: (handle) => (handle != null ? `Facebook: ${handle}` : 'Facebook'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
	},
	'social.shopify': {
		type: 'social' as const,
		provider: 'shopify',
		label: 'Shopify',
		placeholder: 'store-name',
		getUrl: (store) => `https://${store}.myshopify.com`,
		getTitle: (store) => (store != null ? `Shopify: ${store}` : 'Shopify'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?(.+)\.myshopify\.com/, '$2')
	},
	'social.bluesky': {
		type: 'social' as const,
		provider: 'bluesky',
		label: 'Bluesky',
		placeholder: 'handle.bsky.social',
		getUrl: (handle) => `https://bsky.app/profile/${handle}`,
		getTitle: (handle) => (handle != null ? `Bluesky: @${handle}` : 'Bluesky'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?bsky\.app\/profile\//, '')
	},
	'social.discord': {
		type: 'social' as const,
		provider: 'discord',
		label: 'Discord',
		placeholder: 'user-id',
		getUrl: (userId) => `https://discord.com/users/${userId}`,
		getTitle: (userId) => (userId != null ? `Discord: ${userId}` : 'Discord'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?discord\.com\/users\//, '')
	},
	'social.github': {
		type: 'social' as const,
		provider: 'github',
		label: 'GitHub',
		placeholder: 'username',
		getUrl: (handle) => `https://github.com/${handle}`,
		getTitle: (handle) => (handle != null ? `GitHub: @${handle}` : 'GitHub'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?github\.com\//, '')
	},
	'social.google': {
		type: 'social' as const,
		provider: 'google',
		label: 'Google',
		placeholder: 'username',
		getUrl: (handle) => `https://google.com/+${handle}`,
		getTitle: (handle) => (handle != null ? `Google+: ${handle}` : 'Google+'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?google\.com\/+/, '')
	},
	'social.spotify': {
		type: 'social' as const,
		provider: 'spotify',
		label: 'Spotify',
		placeholder: 'username',
		getUrl: (handle) => `https://open.spotify.com/user/${handle}`,
		getTitle: (handle) => (handle != null ? `Spotify: ${handle}` : 'Spotify'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?open\.spotify\.com\/user\//, '')
	},
	'social.pinterest': {
		type: 'social' as const,
		provider: 'pinterest',
		label: 'Pinterest',
		placeholder: 'username',
		getUrl: (handle) => `https://pinterest.com/${handle}`,
		getTitle: (handle) => (handle != null ? `Pinterest: ${handle}` : 'Pinterest'),
		getHandle: (url) => url.replace(/^https?:\/\/(www\.)?pinterest\.com\//, '')
	}
} as const satisfies Record<string, TContactMetadata>;

export type TContactMetadata =
	| {
			type: 'email';
			label: string;
			placeholder: string;
			getUrl: (email: string) => string;
			getTitle: (email?: string) => string;
	  }
	| {
			type: 'phone';
			label: string;
			placeholder: string;
			getUrl: (phone: string) => string;
			getTitle: (phone?: string) => string;
	  }
	| {
			type: 'social';
			provider: TSocialAction['provider'];
			label: string;
			placeholder: string;
			getUrl: (handle: string) => string;
			getTitle: (handle?: string) => string;
			getHandle: (url: string) => string;
	  };

export const contactIconMap = {
	'email': MailIcon,
	'phone': PhoneIcon,
	'social.instagram': InstagramIcon,
	'social.x': XTwitterIcon,
	'social.youtube': YouTubeIcon,
	'social.tiktok': TikTokIcon,
	'social.linkedin': LinkedInIcon,
	'social.facebook': FacebookIcon,
	'social.shopify': ShopifyIcon,
	'social.bluesky': BlueskyIcon,
	'social.discord': DiscordIcon,
	'social.github': GithubIcon,
	'social.google': GoogleIcon,
	'social.spotify': SpotifyIcon,
	'social.pinterest': PinterestIcon
} as const satisfies Record<
	keyof typeof contactMetadataMap,
	React.FC<React.SVGProps<SVGSVGElement>>
>;

export function getContactKey(
	action: TEmailAction | TPhoneAction | TSocialAction
): keyof typeof contactMetadataMap {
	switch (action.type) {
		case 'social':
			return `social.${action.provider}`;
		default:
			return action.type;
	}
}
