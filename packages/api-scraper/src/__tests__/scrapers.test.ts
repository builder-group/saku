import fs from 'node:fs';
import { describe, it } from 'vitest';
import {
	extractInstagramUsername,
	extractUrls,
	fetchInstagramUser,
	TCategorizedUrls
} from '../lib';

describe('Scrapers', () => {
	const RESOURCES_DIR = `${__dirname}/resources/.local`;

	describe('Instagram Bio Links Scraper', () => {
		const MAX_PROFILES = 5;

		// Step 1: Extract Instagram URLs from HTML
		it('Step 1: Extract Instagram URLs from HTML source', { timeout: 0 }, async () => {
			// Read the HTML source
			const html = fs.readFileSync(`${RESOURCES_DIR}/google.html`, 'utf-8');

			// Extract Instagram URLs
			const categorizedUrls = extractUrls(html);

			// Save the results for next step
			fs.writeFileSync(
				`${RESOURCES_DIR}/step1-categorized-urls.json`,
				JSON.stringify(categorizedUrls, null, 2)
			);
		});

		// Step 2: Fetch Instagram user data focusing on bio links
		it('Step 2: Extract Instagram bio links and basic profile data', { timeout: 0 }, async () => {
			// Read results from previous step
			const categorizedUrls = JSON.parse(
				fs.readFileSync(`${RESOURCES_DIR}/step1-categorized-urls.json`, 'utf-8')
			) as TCategorizedUrls;

			// Process limited number of Instagram profile URLs
			const results = [];
			const profileUrls = categorizedUrls.instagram.profiles.slice(0, MAX_PROFILES);

			for (const url of profileUrls) {
				const username = extractInstagramUsername(url);
				if (username == null) {
					console.warn(`Could not extract username from URL: ${url}`);
					continue;
				}

				const userData = await fetchInstagramUser(username);
				if (userData != null) {
					results.push({
						username: userData.username,
						profile_url: url,
						bio_links: userData.bio_links,
						follower_count: userData.follower_count
					});
				}

				// Random delay between 1-3 seconds
				const delay = Math.floor(Math.random() * (3000 + 1)) + 1000;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}

			// Save the focused results
			fs.writeFileSync(
				`${RESOURCES_DIR}/instagram-step2-bio-links.json`,
				JSON.stringify(results, null, 2)
			);
		});
	});
});
