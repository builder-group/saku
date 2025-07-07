import { htmlConfig, tokenize, type TXmlToken } from 'xml-tokenizer';
import { parseInstagramUrl } from './parse-instagram-url';
import { parseXUrl } from './parse-x-url';

/**
 * Extract and categorize URLs from HTML content.
 * Returns Instagram URLs (posts, reels, users), X URLs (posts, users), and unknown URLs.
 */
export function extractUrls(html: string): TCategorizedUrls {
	const reels = new Set<string>();
	const posts = new Set<string>();
	const users = new Set<string>();
	const xPosts = new Set<string>();
	const xUsers = new Set<string>();
	const unknown = new Set<string>();

	tokenize(
		html,
		(token: TXmlToken) => {
			if (token.type === 'Attribute' && token.local === 'href') {
				let url: URL;
				try {
					url = new URL(token.value);
				} catch {
					return;
				}

				const instagramResult = parseInstagramUrl(url);
				if (instagramResult != null) {
					switch (instagramResult.type) {
						case 'reel':
							reels.add(instagramResult.url);
							break;
						case 'post':
							posts.add(instagramResult.url);
							break;
						case 'user':
							users.add(instagramResult.url);
							break;
					}
					return;
				}

				const xResult = parseXUrl(url);
				if (xResult != null) {
					switch (xResult.type) {
						case 'post':
							xPosts.add(xResult.url);
							xUsers.add(xResult.userUrl);
							break;
						case 'user':
							xUsers.add(xResult.url);
							break;
					}
					return;
				}

				unknown.add(token.value);
			}
		},
		htmlConfig
	);

	return {
		instagram: {
			reels: Array.from(reels),
			posts: Array.from(posts),
			users: Array.from(users)
		},
		x: {
			posts: Array.from(xPosts),
			users: Array.from(xUsers)
		},
		unknown: Array.from(unknown)
	};
}

export interface TCategorizedUrls {
	instagram: {
		reels: string[];
		posts: string[];
		users: string[];
	};
	x: {
		posts: string[];
		users: string[];
	};
	unknown: string[];
}
