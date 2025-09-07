import { contactMetadataMap } from '@repo/editor';
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
