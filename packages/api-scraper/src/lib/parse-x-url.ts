/**
 * Parse X (formerly Twitter) URLs into structured data.
 * Supports user and post URLs.
 * Returns null if not a valid X URL.
 */
export function parseXUrl(inputUrl: string | URL): TXUrl | null {
	let url: URL;
	try {
		url = new URL(inputUrl);
	} catch {
		return null;
	}

	if (!url.hostname.match(/^(x\.com|twitter\.com)$/)) {
		return null;
	}

	// Get path segments
	const segments = url.pathname.split('/').filter(Boolean);
	if (segments.length === 0) {
		return null;
	}

	const [username, type, id] = segments;
	if (username == null) {
		return null;
	}

	// Reserved paths that can't be usernames
	if (
		['status', 'search', 'home', 'explore', 'notifications', 'messages', 'i'].includes(username)
	) {
		return null;
	}

	// Handle post URLs
	if (type === 'status' && id != null) {
		return {
			type: 'post',
			url: `https://x.com/${username}/status/${id}`,
			postId: id,
			username,
			userUrl: `https://x.com/${username}`
		};
	}

	// Handle user URLs (must be exactly username only)
	if (type == null) {
		return {
			type: 'user',
			url: `https://x.com/${username}`,
			username
		};
	}

	return null;
}

export interface TXPostUrl {
	type: 'post';
	url: string;
	postId: string;
	username: string;
	userUrl: string;
}

export interface TXUserUrl {
	type: 'user';
	url: string;
	username: string;
}

export type TXUrl = TXPostUrl | TXUserUrl;
