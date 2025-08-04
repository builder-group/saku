import { TSocialLink } from '@repo/editor';

export const socialMetadataMap = {
	instagram: {
		provider: 'instagram',
		label: 'Instagram',
		placeholder: 'username',
		baseUrl: 'https://instagram.com/'
	},
	twitter: {
		provider: 'twitter',
		label: 'Twitter/X',
		placeholder: 'username',
		baseUrl: 'https://twitter.com/'
	},
	youtube: {
		provider: 'youtube',
		label: 'YouTube',
		placeholder: 'channelname',
		baseUrl: 'https://youtube.com/@'
	},
	tiktok: {
		provider: 'tiktok',
		label: 'TikTok',
		placeholder: 'username',
		baseUrl: 'https://tiktok.com/@'
	},
	linkedin: {
		provider: 'linkedin',
		label: 'LinkedIn',
		placeholder: 'username',
		baseUrl: 'https://linkedin.com/in/'
	},
	facebook: {
		provider: 'facebook',
		label: 'Facebook',
		placeholder: 'username',
		baseUrl: 'https://facebook.com/'
	},
	shopify: {
		provider: 'shopify',
		label: 'Shopify',
		placeholder: 'store-name',
		baseUrl: 'https://shopify.com/'
	},
	bluesky: {
		provider: 'bluesky',
		label: 'Bluesky',
		placeholder: 'username.bsky.social',
		baseUrl: 'https://bsky.app/profile/'
	},
	discord: {
		provider: 'discord',
		label: 'Discord',
		placeholder: 'user-id',
		baseUrl: 'https://discord.com/users/'
	},
	github: {
		provider: 'github',
		label: 'GitHub',
		placeholder: 'username',
		baseUrl: 'https://github.com/'
	},
	google: {
		provider: 'google',
		label: 'Google',
		placeholder: 'username',
		baseUrl: 'https://google.com/+'
	},
	spotify: {
		provider: 'spotify',
		label: 'Spotify',
		placeholder: 'username',
		baseUrl: 'https://open.spotify.com/user/'
	},
	pinterest: {
		provider: 'pinterest',
		label: 'Pinterest',
		placeholder: 'username',
		baseUrl: 'https://pinterest.com/'
	}
} as const satisfies Record<TSocialLink['provider'], TSocialMetadata>;

export type TSocialProvider = keyof typeof socialMetadataMap;

export interface TSocialMetadata {
	provider: TSocialLink['provider'];
	label: string;
	placeholder: string;
	baseUrl: string;
}

export const generateSocialUrl = (provider: TSocialLink['provider'], handle: string): string => {
	const metadata = socialMetadataMap[provider];
	return metadata.baseUrl + handle;
};
