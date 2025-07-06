import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import {
	extractInstagramUsername,
	extractUrls,
	fetchGooglePages,
	fetchInstagramUsers,
	TFetchInstagramUsersResult,
	TInstagramUserData,
	TPageData,
	type TCategorizedUrls,
	type TFetchGooglePagesResult
} from '../lib';

describe('Scrapers', () => {
	describe('Instagram Bio Links Scraper', () => {
		const jobId = 'linkpop';
		const bioLinkPattern = 'linkpop.com';
		const resourcesDir = `${__dirname}/resources/.local`;
		const config = {
			resourcesDir,
			step1: {
				outputFile: path.join(resourcesDir, `${jobId}_step1_google-search-pages.json`),
				googlePagesCache: path.join(resourcesDir, '.cache/google-pages'),
				searchQuery: `site:instagram.com "${bioLinkPattern}"`
			},
			step2: {
				outputFile: path.join(resourcesDir, `${jobId}_step2_extracted-instagram-urls.json`)
			},
			step3: {
				outputFile: path.join(resourcesDir, `${jobId}_step3_instagram-profiles.json`),
				instagramUsersCache: path.join(resourcesDir, '.cache/instagram-users')
			},
			step4: {
				outputFile: path.join(resourcesDir, `${jobId}_step4_bio-link-analysis.json`)
			}
		};

		it('Step 1: Fetch Google search pages', { timeout: 0 }, async () => {
			const googlePagesResult = await fetchGooglePages(config.step1.searchQuery, {
				outputDir: config.step1.googlePagesCache,
				maxPages: 50,
				useCache: true
			});

			const result1: TStep1Result = googlePagesResult;
			fs.writeFileSync(config.step1.outputFile, JSON.stringify(result1, null, 2));
		});

		interface TStep1Result extends TFetchGooglePagesResult {}

		it('Step 2: Extract Instagram URLs from Google search pages', { timeout: 0 }, async () => {
			const step1Result = JSON.parse(
				fs.readFileSync(config.step1.outputFile, 'utf-8')
			) as TStep1Result;

			const pages: TStep2Result['pages'] = [];
			const instagramUsernames: Set<string> = new Set();
			for (const page of step1Result.pages) {
				if (page.status === 'error') {
					continue;
				}

				let pageData: TPageData;
				try {
					const fileContent = fs.readFileSync(page.filePath, 'utf-8');
					pageData = JSON.parse(fileContent) as TPageData;
				} catch (error) {
					console.error(`❌ Error reading file ${page.filePath}: ${error}`);
					continue;
				}

				const urls = extractUrls(pageData.html);
				pages.push({
					page: {
						filePath: page.filePath
					},
					urls
				});
				urls.instagram.users.forEach((user) => {
					const username = extractInstagramUsername(user);
					if (username == null) {
						console.warn(`Could not extract username from URL: ${user}`);
						return;
					}
					instagramUsernames.add(username);
				});
			}

			const result2: TStep2Result = {
				instagram: {
					usernames: Array.from(instagramUsernames)
				},
				pages,
				timestamp: new Date().toISOString()
			};
			fs.writeFileSync(config.step2.outputFile, JSON.stringify(result2, null, 2));
		});

		interface TStep2Result {
			instagram: {
				usernames: string[];
			};
			pages: { page: { filePath: string }; urls: TCategorizedUrls }[];
			timestamp: string;
		}

		it('Step 3: Fetch Instagram bio links and basic user data', { timeout: 0 }, async () => {
			const step2Result = JSON.parse(
				fs.readFileSync(path.join(config.step2.outputFile), 'utf-8')
			) as TStep2Result;

			const usersResult = await fetchInstagramUsers(step2Result.instagram.usernames, {
				outputDir: config.step3.instagramUsersCache,
				useCache: true
			});

			const result3: TStep3Result = usersResult;
			fs.writeFileSync(config.step3.outputFile, JSON.stringify(result3, null, 2));
		});

		interface TStep3Result extends TFetchInstagramUsersResult {}

		it('Step 4: Extract bio links from Instagram users', { timeout: 0 }, async () => {
			const step3Result = JSON.parse(
				fs.readFileSync(path.join(config.step3.outputFile), 'utf-8')
			) as TStep3Result;

			const result4: TStep4Result = {
				users: [],
				timestamp: new Date().toISOString()
			};

			for (const userResult of step3Result.users) {
				if (userResult.status === 'error') {
					console.warn(`⚠️ Skipping user due to error: ${userResult.error}`);
					continue;
				}

				let userData: TInstagramUserData;
				try {
					const fileContent = fs.readFileSync(userResult.filePath, 'utf-8');
					userData = JSON.parse(fileContent) as TInstagramUserData;
				} catch (error) {
					console.error(`❌ Error reading user data from ${userResult.filePath}: ${error}`);
					continue;
				}
				const { user } = userData;

				// Filter bio links containing the pattern
				const matchingBioLink = user.bio_links.find((link) => link.url.includes(bioLinkPattern));

				// Only include users that have a matching bio link
				if (matchingBioLink != null) {
					result4.users.push({
						username: user.username,
						bioLink: matchingBioLink.url,
						isVerified: user.is_verified,
						followerCount: user.edge_followed_by?.count
					});
				} else {
					console.warn(`⚠️ Skipping @${user.username} - no bio links matching "${bioLinkPattern}"`);
				}
			}

			console.log(`✅ Found ${result4.users.length} users with ${bioLinkPattern} bio link`);

			fs.writeFileSync(config.step4.outputFile, JSON.stringify(result4, null, 2));
		});

		interface TStep4Result {
			users: Array<{
				username: string;
				bioLink: string;
				isVerified: boolean;
				followerCount?: number;
			}>;
			timestamp: string;
		}
	});
});
