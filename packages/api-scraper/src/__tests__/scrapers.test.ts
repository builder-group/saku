import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import {
	extractInstagramUsername,
	extractUrls,
	extractXUsername,
	fetchGooglePages,
	fetchInstagramUsers,
	fetchXUsers,
	TFetchInstagramUsersResult,
	TFetchXUsersResult,
	TInstagramUserData,
	TPageData,
	TXUserData,
	type TCategorizedUrls,
	type TFetchGooglePagesResult
} from '../lib';

describe('Scrapers', () => {
	describe('Social Bio Links Scraper', () => {
		const jobId = 'linkpop';
		const bioLinkPattern = 'linkpop.com';
		const resourcesDir = `${__dirname}/resources/.local`;
		const config = {
			resourcesDir,
			step1: {
				outputFile: path.join(resourcesDir, `${jobId}_step1_google-search-pages.json`),
				googlePagesCache: path.join(resourcesDir, '.cache/google-pages'),
				searchQueries: {
					instagram: `site:instagram.com "${bioLinkPattern}"`,
					x: `site:(x.com OR twitter.com) "${bioLinkPattern}"`
				}
			},
			step2: {
				outputFile: path.join(resourcesDir, `${jobId}_step2_extracted-social-urls.json`)
			},
			step3: {
				outputFile: path.join(resourcesDir, `${jobId}_step3_social-profiles.json`),
				instagramUsersCache: path.join(resourcesDir, '.cache/instagram-users'),
				xUsersCache: path.join(resourcesDir, '.cache/x-users')
			},
			step4: {
				outputFile: path.join(resourcesDir, `${jobId}_step4_bio-link-analysis.json`)
			}
		};

		it('Step 1: Fetch Google search pages for both platforms', { timeout: 0 }, async () => {
			const fetchPlatformPages = async (
				platform: 'instagram' | 'x'
			): Promise<TFetchGooglePagesResult> => {
				return fetchGooglePages(config.step1.searchQueries[platform], {
					outputDir: config.step1.googlePagesCache,
					maxPages: 50,
					useCache: true
				});
			};

			const [instagramPages, xPages] = await Promise.all([
				fetchPlatformPages('instagram'),
				fetchPlatformPages('x')
			]);

			const result1: TStep1Result = {
				instagram: instagramPages,
				x: xPages,
				timestamp: new Date().toISOString()
			};
			fs.writeFileSync(config.step1.outputFile, JSON.stringify(result1, null, 2));
		});

		interface TStep1Result {
			instagram: TFetchGooglePagesResult;
			x: TFetchGooglePagesResult;
			timestamp: string;
		}

		it('Step 2: Extract social URLs from Google search pages', { timeout: 0 }, async () => {
			const step1Result = JSON.parse(
				fs.readFileSync(config.step1.outputFile, 'utf-8')
			) as TStep1Result;

			const processSocialPages = (
				pages: TFetchGooglePagesResult['pages'],
				extractUsername: (url: string) => string | null,
				platform: 'instagram' | 'x'
			): { pages: TStep2Result['pages']; usernames: Set<string> } => {
				const processedPages: TStep2Result['pages'] = [];
				const usernames = new Set<string>();

				for (const page of pages) {
					if (page.status === 'error') continue;

					let pageData: TPageData;
					try {
						const fileContent = fs.readFileSync(page.filePath, 'utf-8');
						pageData = JSON.parse(fileContent) as TPageData;
					} catch (error) {
						console.error(`❌ Error reading file ${page.filePath}: ${error}`);
						continue;
					}

					const urls = extractUrls(pageData.html);
					processedPages.push({
						page: { filePath: page.filePath },
						urls
					});

					// Extract usernames from platform URLs
					urls[platform].users.forEach((user: string) => {
						const username = extractUsername(user);
						if (username == null) {
							console.warn(`Could not extract username from URL: ${user}`);
							return;
						}
						usernames.add(username);
					});
				}

				return { pages: processedPages, usernames };
			};

			const [instagramResults, xResults] = await Promise.all([
				processSocialPages(step1Result.instagram.pages, extractInstagramUsername, 'instagram'),
				processSocialPages(step1Result.x.pages, extractXUsername, 'x')
			]);

			const result2: TStep2Result = {
				instagram: {
					usernames: Array.from(instagramResults.usernames)
				},
				x: {
					usernames: Array.from(xResults.usernames)
				},
				pages: [...instagramResults.pages, ...xResults.pages],
				timestamp: new Date().toISOString()
			};
			fs.writeFileSync(config.step2.outputFile, JSON.stringify(result2, null, 2));
		});

		interface TStep2Result {
			instagram: {
				usernames: string[];
			};
			x: {
				usernames: string[];
			};
			pages: { page: { filePath: string }; urls: TCategorizedUrls }[];
			timestamp: string;
		}

		it('Step 3: Fetch social profile bio links and basic user data', { timeout: 0 }, async () => {
			const step2Result = JSON.parse(
				fs.readFileSync(path.join(config.step2.outputFile), 'utf-8')
			) as TStep2Result;

			const [instagramUsers, xUsers] = await Promise.all([
				fetchInstagramUsers(step2Result.instagram.usernames, {
					outputDir: config.step3.instagramUsersCache,
					useCache: true
				}),
				fetchXUsers(step2Result.x.usernames, {
					outputDir: config.step3.xUsersCache,
					useCache: true
				})
			]);

			const result3: TStep3Result = {
				instagram: instagramUsers,
				x: xUsers,
				timestamp: new Date().toISOString()
			};
			fs.writeFileSync(config.step3.outputFile, JSON.stringify(result3, null, 2));
		});

		interface TStep3Result {
			instagram: TFetchInstagramUsersResult;
			x: TFetchXUsersResult;
			timestamp: string;
		}

		it('Step 4: Extract bio links from social profiles', { timeout: 0 }, async () => {
			const step3Result = JSON.parse(
				fs.readFileSync(path.join(config.step3.outputFile), 'utf-8')
			) as TStep3Result;

			const result4: TStep4Result = {
				instagram: {
					users: []
				},
				x: {
					users: []
				},
				timestamp: new Date().toISOString()
			};

			// Process Instagram users
			for (const user of step3Result.instagram.users) {
				if (user.status === 'error') {
					console.warn(`⚠️ Skipping user due to error: ${user.error}`);
					continue;
				}

				let userData: TInstagramUserData;
				try {
					const fileContent = fs.readFileSync(user.filePath, 'utf-8');
					userData = JSON.parse(fileContent);
				} catch (error) {
					console.error(`❌ Error reading user data from ${user.filePath}: ${error}`);
					continue;
				}
				const instagramUser = userData.user;

				const bioLink = instagramUser.bio_links?.[0]?.url ?? instagramUser.external_url;
				if (bioLink != null) {
					result4.instagram.users.push({
						username: instagramUser.username,
						profileUrl: `https://instagram.com/${instagramUser.username}`,
						bioLink,
						isVerified: instagramUser.is_verified,
						followerCount: instagramUser.edge_followed_by?.count
					});
				}
			}

			// Process X users
			for (const user of step3Result.x.users) {
				if (user.status === 'error') {
					console.warn(`⚠️ Skipping user due to error: ${user.error}`);
					continue;
				}

				let userData: TXUserData;
				try {
					const fileContent = fs.readFileSync(user.filePath, 'utf-8');
					userData = JSON.parse(fileContent);
				} catch (error) {
					console.error(`❌ Error reading user data from ${user.filePath}: ${error}`);
					continue;
				}
				const xUser = userData.user;

				const bioLink = xUser.entities?.url?.urls?.[0]?.expanded_url;
				if (bioLink != null) {
					result4.x.users.push({
						username: xUser.username,
						profileUrl: `https://x.com/${xUser.username}`,
						bioLink,
						isVerified: xUser.verified,
						followerCount: xUser.public_metrics?.followers_count
					});
				}
			}

			fs.writeFileSync(config.step4.outputFile, JSON.stringify(result4, null, 2));
		});

		interface TStep4Result {
			instagram: {
				users: {
					username: string;
					profileUrl: string;
					bioLink: string;
					isVerified: boolean;
					followerCount?: number;
				}[];
			};
			x: {
				users: {
					username: string;
					profileUrl: string;
					bioLink: string;
					isVerified: boolean;
					followerCount?: number;
				}[];
			};
			timestamp: string;
		}
	});
});
