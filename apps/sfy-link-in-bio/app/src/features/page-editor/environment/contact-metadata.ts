import { contactMetadataMap } from '@repo/editor';
import {
	BlueskyIcon,
	DiscordIcon,
	FacebookIcon,
	GithubIcon,
	GlobeIcon,
	GoogleIcon,
	InstagramIcon,
	LinkedInIcon,
	MailIcon,
	PatreonIcon,
	PhoneIcon,
	PinterestIcon,
	ShopifyIcon,
	SpotifyIcon,
	TikTokIcon,
	WhatsAppIcon,
	XTwitterIcon,
	YouTubeIcon
} from '@/components';

export const contactIconMap = {
	'link': GlobeIcon,
	'email': MailIcon,
	'phone': PhoneIcon,
	'social.instagram': InstagramIcon,
	'social.x': XTwitterIcon,
	'social.youtube': YouTubeIcon,
	'social.tiktok': TikTokIcon,
	'social.linkedin': LinkedInIcon,
	'social.facebook': FacebookIcon,
	'social.whatsapp': WhatsAppIcon,
	'social.shopify': ShopifyIcon,
	'social.bluesky': BlueskyIcon,
	'social.discord': DiscordIcon,
	'social.github': GithubIcon,
	'social.google': GoogleIcon,
	'social.spotify': SpotifyIcon,
	'social.pinterest': PinterestIcon,
	'social.patreon': PatreonIcon
} as const satisfies Record<
	keyof typeof contactMetadataMap,
	React.FC<React.SVGProps<SVGSVGElement>>
>;
