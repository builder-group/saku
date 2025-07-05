import fs from 'node:fs';
import { describe, it } from 'vitest';
import { htmlConfig, tokenize, type TXmlToken } from 'xml-tokenizer';
import { parseInstagramUrl } from '../lib';

describe('playground', () => {
	it('should extract instagram urls from html', () => {
		// Read the HTML file
		const html = fs.readFileSync(`${__dirname}/resources/.local/google.html`, 'utf-8');

		// Track unique URLs by type
		const reels = new Set<string>();
		const posts = new Set<string>();
		const accounts = new Set<string>();

		// Process HTML and extract URLs
		tokenize(
			html,
			(token: TXmlToken) => {
				if (token.type === 'Attribute' && token.local === 'href') {
					// Try to parse as Instagram URL
					const result = parseInstagramUrl(token.value);
					if (result == null) {
						return;
					}

					// Add to appropriate set based on type
					switch (result.type) {
						case 'reel':
							reels.add(result.url);
							if (result.accountUrl) {
								accounts.add(result.accountUrl);
							}
							break;
						case 'post':
							posts.add(result.url);
							break;
						case 'account':
							accounts.add(result.url);
							break;
					}
				}
			},
			htmlConfig
		);

		// Log results
		console.log('\nExtracted Instagram URLs:');
		console.log('------------------------');
		console.log(`Reels found: ${reels.size}`);
		console.log(`Posts found: ${posts.size}`);
		console.log(`Accounts found: ${accounts.size}`);
		console.log('------------------------');

		// Write results to file for inspection
		const results = {
			reels: Array.from(reels).sort(),
			posts: Array.from(posts).sort(),
			accounts: Array.from(accounts).sort()
		};

		fs.writeFileSync(
			`${__dirname}/resources/.local/instagram-urls.json`,
			JSON.stringify(results, null, 2)
		);
	});
});
