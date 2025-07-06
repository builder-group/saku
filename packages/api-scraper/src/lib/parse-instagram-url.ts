/**
 * Parse Instagram URLs into structured data.
 * Supports user, post, and reel URLs.
 * Returns null if not a valid Instagram URL.
 */
export function parseInstagramUrl(inputUrl: string | URL): TInstagramUrl | null {
	let url: URL;
	try {
		url = new URL(inputUrl);
	} catch {
		return null;
	}

	if (!url.hostname.includes('instagram.com')) {
		return null;
	}

	// Get path segments
	const segments = url.pathname.split('/').filter(Boolean);
	if (segments.length === 0) {
		return null;
	}

	const [type, id] = segments;

	// Handle post URLs
	if (type === 'p' && id) {
		return {
			type: 'post',
			url: `https://www.instagram.com/p/${id}`,
			postId: id
		};
	}

	// Handle reel URLs
	if ((type === 'reel' || type === 'reels') && id) {
		return {
			type: 'reel',
			url: `https://www.instagram.com/reel/${id}`,
			reelId: id
		};
	}

	// Handle user URLs (anything not matching above patterns)
	if (type != null && !['p', 'reel', 'reels'].includes(type)) {
		return {
			type: 'user',
			url: `https://www.instagram.com/${type}`,
			username: type
		};
	}

	return null;
}

interface TInstagramReelUrl {
	type: 'reel';
	url: string;
	reelId: string;
}

interface TInstagramPostUrl {
	type: 'post';
	url: string;
	postId: string;
}

interface TInstagramUserUrl {
	type: 'user';
	url: string;
	username: string;
}

type TInstagramUrl = TInstagramReelUrl | TInstagramPostUrl | TInstagramUserUrl;
