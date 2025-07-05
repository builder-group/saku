// Common modern user agents
const USER_AGENTS = [
	// Chrome on Windows
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	// Chrome on macOS
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
	// Firefox on Windows
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
	// Firefox on macOS
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
	// Safari on macOS
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15',
	// Edge on Windows
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'
];

/**
 * Simple user agent rotator
 * Returns a different user agent on each call
 */
export function rotateUserAgent(): string {
	const index = Math.floor(Math.random() * USER_AGENTS.length);
	// @ts-expect-error -- index is always in range
	return USER_AGENTS[index];
}
