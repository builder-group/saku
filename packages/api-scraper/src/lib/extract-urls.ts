import { htmlConfig, tokenize, type TXmlToken } from 'xml-tokenizer';
import { parseInstagramUrl } from './parse-instagram-url';

/**
 * Extract and categorize URLs from HTML content.
 * Returns Instagram URLs (posts, reels, users) and unknown URLs.
 */
export function extractUrls(html: string): TCategorizedUrls {
	const reels = new Set<string>();
	const posts = new Set<string>();
	const users = new Set<string>();
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

				const result = parseInstagramUrl(url);
				if (result != null) {
					switch (result.type) {
						case 'reel':
							reels.add(result.url);
							break;
						case 'post':
							posts.add(result.url);
							break;
						case 'user':
							users.add(result.url);
							break;
					}
				} else {
					unknown.add(token.value);
				}
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
		unknown: Array.from(unknown)
	};
}

export interface TCategorizedUrls {
	instagram: {
		reels: string[];
		posts: string[];
		users: string[];
	};
	unknown: string[];
}
