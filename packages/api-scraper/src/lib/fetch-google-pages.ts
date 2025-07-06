import fs from 'node:fs';
import path from 'node:path';
import { RequestError } from 'feature-fetch';
import { fetchClient } from '../environment';
import { createObjectHash } from './create-object-hash';
import { findGoogleSearchResultsHtml } from './find-google-search-result-html';

export async function fetchGooglePages(
	searchQuery: string,
	config: TFetchGooglePagesConfig
): Promise<TFetchGooglePagesResult> {
	const {
		maxPages = 5,
		outputDir,
		startPage = 1,
		delayBetweenRequests = 500,
		useCache = false
	} = config;
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

		const searchQueryParams: TGoogleSearchQueryParams = {
			q: searchQuery,
			start: start.toString(),
			num: resultsPerPage.toString(),
			hl: 'en',
			gl: 'us'
		};

		const hash = createObjectHash(searchQueryParams, 8);
		const fileName = `google-${hash}.json`;
		const filePath = path.join(outputDir, fileName);

		// Check cache first if enabled
		if (useCache && fs.existsSync(filePath)) {
			let pageData: TPageData | null = null;
			try {
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				pageData = JSON.parse(fileContent) as TPageData;
			} catch (error) {
				console.log(`⚠️  Cache data invalid for ${fileName}, refetching...`);
			}

			if (pageData != null) {
				console.log(`📂 Using cached results from ${pageData.metadata.timestamp}`);
				pages.push({
					status: 'success',
					filePath,
					cached: true
				} satisfies TSuccessPageResult);
				continue;
			}
		}

		console.log(`📄 Fetching results (start=${start})...`);

		const result = await fetchClient.proxyGet('https://www.google.com/search', {
			queryParams: searchQueryParams,
			locale: 'en-US',
			geoLocation: 'United States',
			userAgentType: 'desktop_chrome'
		});
		if (result.isErr()) {
			const errorMsg = `Failed to fetch results: ${result.error}`;
			console.error(`❌ ${errorMsg}`);

			if (result.error instanceof RequestError) {
				console.error(`🛑 Stopping due to RequestError: ${result.error.message}`);
				shouldContinue = false;
			}

			pages.push({
				status: 'error',
				query: searchQueryParams,
				error: errorMsg
			} satisfies TErrorPageResult);
			continue;
		}

		const content = result.value.data.results[0]?.content;
		if (content == null || !content.length) {
			const errorMsg = `Search returned empty content`;
			console.error(`❌ ${errorMsg}`);
			pages.push({
				status: 'error',
				query: searchQueryParams,
				error: errorMsg
			} satisfies TErrorPageResult);
			continue;
		}

		// Extract just the search results content
		const searchResultsHtml = findGoogleSearchResultsHtml(content);
		if (searchResultsHtml == null) {
			console.log(`🔍 No more search results found`);
			shouldContinue = false;
			break;
		}

		const timestamp = new Date().toISOString();
		const pageData: TPageData = {
			html: searchResultsHtml,
			metadata: {
				query: searchQueryParams,
				timestamp
			}
		};

		// Save the combined data
		try {
			fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf-8');
		} catch (error) {
			const errorMsg = `Failed to save results: ${error}`;
			console.error(`❌ ${errorMsg}`);
			pages.push({
				status: 'error',
				query: searchQueryParams,
				error: errorMsg
			} satisfies TErrorPageResult);
			continue;
		}

		pages.push({
			status: 'success',
			filePath,
			cached: false
		} satisfies TSuccessPageResult);

		console.log(`✅ Results saved as ${fileName} (${searchResultsHtml.length} chars)`);

		// Add delay between requests to avoid rate limiting
		if (page < startPage + maxPages - 1 && shouldContinue) {
			console.log(`⏱️  Waiting ${delayBetweenRequests}ms before next request...`);
			await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
		}
	}

	const successfulPages = pages.filter((p) => p.status === 'success');
	const failedPages = pages.filter((p) => p.status === 'error');

	console.log(
		`🎉 Completed: ${successfulPages.length}/${successfulPages.length + failedPages.length} pages fetched successfully`
	);
	if (failedPages.length > 0) {
		console.log(`❌ Failed: ${failedPages.length} pages had errors`);
	}
	if (!shouldContinue) {
		console.log('🔍 Search completed - all results processed');
	}

	return {
		searchQuery,
		pages,
		timestamp: new Date().toISOString()
	};
}

export interface TFetchGooglePagesConfig {
	outputDir: string;
	maxPages?: number;
	startPage?: number;
	delayBetweenRequests?: number;
	useCache?: boolean;
}

export interface TGoogleSearchQueryParams extends Record<string, string> {
	q: string;
	start: string;
	num: string;
	hl: string;
	gl: string;
}

export interface TPageData {
	html: string;
	metadata: {
		query: TGoogleSearchQueryParams;
		timestamp: string;
	};
}

export interface TFetchGooglePagesResult {
	searchQuery: string;
	pages: TPageResult[];
	timestamp: string;
}

export type TPageResult = TSuccessPageResult | TErrorPageResult;

export interface TSuccessPageResult {
	status: 'success';
	filePath: string;
	cached: boolean;
}

export interface TErrorPageResult {
	status: 'error';
	query: TGoogleSearchQueryParams;
	error: string;
}
