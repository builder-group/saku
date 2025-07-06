import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import {
	extractInstagramUsername,
	fetchGooglePages,
	fetchInstagramUser,
	type TCategorizedUrls,
	type TFetchGooglePagesResult
} from '../lib';

describe('Scrapers', () => {
	const RESOURCES_DIR = `${__dirname}/resources/.local`;

	describe('Instagram Bio Links Scraper', () => {
		const MAX_PROFILES = 5;
		const GOOGLE_PAGES_DIR = path.join(RESOURCES_DIR, 'google-pages');
		const EXTRACTED_URLS_DIR = path.join(RESOURCES_DIR, 'extracted-urls');
		const SEARCH_QUERY = 'site:instagram.com "/a/linkshop"';

		it('Step 1: Fetch Google search pages via proxy', { timeout: 0 }, async () => {
			const googlePages = await fetchGooglePages(SEARCH_QUERY, {
				maxPages: 2,
				outputDir: GOOGLE_PAGES_DIR
			});

			console.log('📊 Fetch Results:', {
				searchQuery: googlePages.searchQuery,
				statistics: googlePages.statistics,
				config: googlePages.config,
				timestamp: googlePages.timestamp
			});

			googlePages.pages.forEach((page) => {
				if (page.status === 'success') {
					console.log(
						`✅ Page ${page.page}: ${page.fileName} (${page.contentLength} chars) -> ${page.filePath}`
					);
				} else {
					console.log(`❌ Page ${page.page}: ${page.error}`);
				}
			});

			fs.writeFileSync(
				path.join(RESOURCES_DIR, 'step1-fetch-result.json'),
				JSON.stringify(googlePages, null, 2)
			);
		});

		it('Step 2: Extract Instagram URLs from saved HTML files', { timeout: 0 }, async () => {
			// Read results from previous step
			const fetchResult = JSON.parse(
				fs.readFileSync(path.join(RESOURCES_DIR, 'step1-fetch-result.json'), 'utf-8')
			) as TFetchGooglePagesResult;

			// TODO
		});

		it('Step 3: Extract Instagram bio links and basic profile data', { timeout: 0 }, async () => {
			// Read results from previous step
			const categorizedUrls = JSON.parse(
				fs.readFileSync(path.join(EXTRACTED_URLS_DIR, 'combined-categorized-urls.json'), 'utf-8')
			) as TCategorizedUrls;

			// Process limited number of Instagram profile URLs
			const results = [];
			const profileUrls = categorizedUrls.instagram.profiles.slice(0, MAX_PROFILES);

			console.log(`🔍 Processing ${profileUrls.length} Instagram profiles...`);

			for (const url of profileUrls) {
				const username = extractInstagramUsername(url);
				if (username == null) {
					console.warn(`Could not extract username from URL: ${url}`);
					continue;
				}

				console.log(`👤 Fetching data for @${username}...`);

				const userData = await fetchInstagramUser(username);
				if (userData != null) {
					results.push({
						username: userData.username,
						profile_url: url,
						bio_links: userData.bio_links,
						follower_count: userData.follower_count,
						full_name: userData.full_name,
						biography: userData.biography
					});

					console.log(
						`✅ @${username}: ${userData.bio_links.length} bio links, ${userData.follower_count} followers`
					);
				} else {
					console.warn(`❌ Failed to fetch data for @${username}`);
				}

				// Random delay between 1-3 seconds
				const delay = Math.floor(Math.random() * (3000 + 1)) + 1000;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}

			// Save the focused results
			fs.writeFileSync(
				path.join(RESOURCES_DIR, 'step3-bio-links.json'),
				JSON.stringify(results, null, 2)
			);

			console.log(`🎉 Completed! Found ${results.length} profiles with bio link data`);
		});
	});
});
