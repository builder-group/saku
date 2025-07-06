import fs from 'node:fs';
import path from 'node:path';
import { RequestError } from 'feature-fetch';
import { fetchClient } from '../environment';
import { findSearchResultsContent } from './find-search-result-content';

export async function fetchGooglePages(
	searchQuery: string,
	config: TFetchGooglePagesConfig
): Promise<TFetchGooglePagesResult> {
	const { maxPages = 5, outputDir, startPage = 1, delayBetweenRequests = 500 } = config;
	const resultsPerPage = 100; // Google allows up to 100 results per page

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const pages: TPageResult[] = [];
	let shouldContinue = true;

	console.log(`🔍 Fetching up to ${maxPages} Google search pages for: "${searchQuery}"`);

	for (let page = startPage; page < startPage + maxPages && shouldContinue; page++) {
		const start = (page - 1) * resultsPerPage;
		const fileName = `google-page-${page.toString().padStart(3, '0')}.html`;
		const filePath = path.join(outputDir, fileName);

		console.log(`📄 Fetching page ${page} (start=${start})...`);

		const result = await fetchClient.proxyGet('https://www.google.com/search', {
			queryParams: {
				q: searchQuery,
				start: start.toString(),
				num: resultsPerPage.toString(), // Maximum results per page
				hl: 'en', // Language
				gl: 'us' // Country
			},
			locale: 'en-US',
			geoLocation: 'United States',
			userAgentType: 'desktop_chrome'
		});
		if (result.isErr()) {
			const errorMsg = `Failed to fetch page ${page}: ${result.error}`;
			console.error(`❌ ${errorMsg}`);

			if (result.error instanceof RequestError) {
				console.error(`🛑 Stopping due to RequestError: ${result.error.message}`);
				shouldContinue = false;
			}

			pages.push({
				page,
				fileName,
				status: 'error',
				error: errorMsg,
				timestamp: new Date().toISOString()
			} satisfies TErrorPageResult);
			continue;
		}

		const content = result.value.data.results[0]?.content;
		if (content == null || !content.length) {
			const errorMsg = `Page ${page} returned empty content`;
			console.error(`❌ ${errorMsg}`);
			pages.push({
				page,
				fileName,
				status: 'error',
				error: errorMsg,
				timestamp: new Date().toISOString()
			} satisfies TErrorPageResult);
			continue;
		}

		// Extract just the search results content
		const searchResultsContent = findSearchResultsContent(content);
		if (searchResultsContent == null) {
			console.log(`🔍 No more search results found on page ${page}`);
			shouldContinue = false;
			break;
		}

		// Save the page to the output directory
		try {
			fs.writeFileSync(filePath, searchResultsContent, 'utf-8');
		} catch (error) {
			const errorMsg = `Failed to save page ${page}: ${error}`;
			console.error(`❌ ${errorMsg}`);
			pages.push({
				page,
				fileName,
				status: 'error',
				error: errorMsg,
				timestamp: new Date().toISOString()
			} satisfies TErrorPageResult);
			continue;
		}

		pages.push({
			page,
			fileName,
			filePath,
			status: 'success',
			contentLength: searchResultsContent.length,
			timestamp: new Date().toISOString()
		} satisfies TSuccessPageResult);

		console.log(`✅ Page ${page} saved as ${fileName} (${searchResultsContent.length} chars)`);

		// Add delay between requests to avoid rate limiting
		if (page < startPage + maxPages - 1 && shouldContinue) {
			console.log(`⏱️  Waiting ${delayBetweenRequests}ms before next request...`);
			await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
		}
	}

	const successfulPages = pages.filter((p) => p.status === 'success');
	const failedPages = pages.filter((p) => p.status === 'error');

	console.log(`🎉 Completed: ${successfulPages.length}/${maxPages} pages fetched successfully`);
	if (failedPages.length > 0) {
		console.log(`❌ Failed: ${failedPages.length} pages had errors`);
	}
	if (!shouldContinue) {
		console.log('🔍 Search completed - all results processed');
	}

	return {
		searchQuery,
		config: {
			maxPages,
			outputDir,
			startPage,
			delayBetweenRequests
		},
		pages,
		statistics: {
			total: maxPages,
			successful: successfulPages.length,
			failed: failedPages.length
		},
		timestamp: new Date().toISOString()
	};
}
export interface TFetchGooglePagesConfig {
	outputDir: string;
	maxPages?: number;
	startPage?: number;
	delayBetweenRequests?: number;
}

export interface TSuccessPageResult {
	page: number;
	fileName: string;
	filePath: string;
	status: 'success';
	contentLength: number;
	timestamp: string;
}

export interface TErrorPageResult {
	page: number;
	fileName: string;
	status: 'error';
	error: string;
	timestamp: string;
}

export type TPageResult = TSuccessPageResult | TErrorPageResult;

export interface TFetchGooglePagesResult {
	searchQuery: string;
	config: {
		maxPages: number;
		outputDir: string;
		startPage: number;
		delayBetweenRequests: number;
	};
	pages: TPageResult[];
	statistics: {
		total: number;
		successful: number;
		failed: number;
	};
	timestamp: string;
}
