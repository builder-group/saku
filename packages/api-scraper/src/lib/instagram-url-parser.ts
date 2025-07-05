// Type definitions for different Instagram URL formats
type TInstagramReelUrl = {
	type: 'reel';
	url: string;
	account: string;
	accountUrl: string;
};

type TInstagramPostUrl = {
	type: 'post';
	url: string;
	postId: string;
};

type TInstagramTvUrl = {
	type: 'tv';
	url: string;
	videoId: string;
};

type TInstagramGuideUrl = {
	type: 'guide';
	url: string;
	account: string;
	accountUrl: string;
	guideSlug: string;
	guideId: string;
};

type TInstagramAccountUrl = {
	type: 'account';
	url: string;
	account: string;
};

type TInstagramUrlResult =
	| TInstagramReelUrl
	| TInstagramPostUrl
	| TInstagramTvUrl
	| TInstagramGuideUrl
	| TInstagramAccountUrl
	| null;

/**
 * Parse Instagram URLs into structured data
 * Returns null if not a valid Instagram URL
 */
export function parseInstagramUrl(inputUrl: string): TInstagramUrlResult {
	let url;
	try {
		url = new URL(inputUrl);
	} catch {
		return null;
	}

	// Simple hostname check
	if (!url.hostname.includes('instagram.com')) {
		return null;
	}

	// Split path into parts and remove empty strings
	const parts = url.pathname.split('/').filter(Boolean);
	if (!parts.length) {
		return null;
	}

	const firstPart = parts[0];
	if (firstPart == null) {
		return null;
	}

	// Simple URL builder
	const makeUrl = (path: string) => `https://www.instagram.com/${path}`;

	// Handle reel URLs
	if (firstPart === 'reel' || firstPart === 'reels') {
		// Direct reel URL: /reel/[code] or /reels/[code]
		const code = parts[1];
		if (code == null) {
			return null;
		}

		return {
			type: 'reel',
			url: makeUrl(parts.join('/')),
			account: firstPart,
			accountUrl: makeUrl(firstPart)
		};
	}

	// Handle account-specific reel URL: /[account]/reel/[code] or /[account]/reels/[code]
	if (parts.length > 2 && (parts[1] === 'reel' || parts[1] === 'reels')) {
		const code = parts[2];
		if (code == null) {
			return null;
		}

		return {
			type: 'reel',
			url: makeUrl(parts.join('/')),
			account: firstPart,
			accountUrl: makeUrl(firstPart)
		};
	}

	// Handle post URLs
	if (firstPart === 'p') {
		const postId = parts[1];
		if (postId == null) {
			return null;
		}

		return {
			type: 'post',
			url: makeUrl(parts.join('/')),
			postId
		};
	}

	// Handle TV URLs
	if (firstPart === 'tv') {
		const videoId = parts[1];
		if (videoId == null) {
			return null;
		}

		return {
			type: 'tv',
			url: makeUrl(parts.join('/')),
			videoId
		};
	}

	// Handle guide URLs: /[account]/guide/[slug]/[id]
	if (parts.length >= 4 && parts[1] === 'guide') {
		const account = parts[0];
		const guideSlug = parts[2];
		const guideId = parts[3];
		if (!account || !guideSlug || !guideId) return null;

		return {
			type: 'guide',
			url: makeUrl(parts.join('/')),
			account,
			accountUrl: makeUrl(account),
			guideSlug,
			guideId
		};
	}

	// Skip special paths and incomplete guide URLs
	if (
		['explore', 'direct', 'stories', 'tags', 'locations'].includes(firstPart) ||
		(parts.length > 1 && parts[1] === 'guide')
	) {
		return null;
	}

	// Handle account URLs
	return {
		type: 'account',
		url: makeUrl(firstPart),
		account: firstPart
	};
}
