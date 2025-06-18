const predefinedFavicons: Record<string, string> = {
	'youtube.com': 'https://saku.so/favicons/youtube.svg',
	'github.com': 'https://saku.so/favicons/github.svg',
	'twitter.com': 'https://saku.so/favicons/x.svg',
	'x.com': 'https://saku.so/favicons/x.svg',
	'discord.com': 'https://saku.so/favicons/discord.svg',
	'bsky.app': 'https://saku.so/favicons/bsky.svg',
	'wip.co': 'https://saku.so/favicons/wip.svg',
	'instagram.com': 'https://saku.so/favicons/instagram.svg',
	'spotify.com': 'https://saku.so/favicons/spotify.svg',
	'cal.com': 'https://saku.so/favicons/calcom.svg',
	'linkedin.com': 'https://saku.so/favicons/linkedin.svg',
	'shopify.com': 'https://saku.so/favicons/shopify.svg',
	'tiktok.com': 'https://saku.so/favicons/tiktok.svg'
};

export function getPredefinedFavicon(url: string): string | null {
	try {
		const domain = new URL(url).hostname.replace('www.', '');
		return predefinedFavicons[domain] || null;
	} catch {
		return null;
	}
}
