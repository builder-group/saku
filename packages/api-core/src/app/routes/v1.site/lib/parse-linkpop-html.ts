import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppError } from '@repo/hono-utils';
import { htmlConfig, tokenize, type TXmlToken } from 'xml-tokenizer';
import { logger } from '@/environment';

export async function parseLinkpopHtml(html: string): Promise<TLinkPopData> {
	const linkpopDataString = await getLinkpopDataString(html);

	// Decode HTML entities
	const decodedData = linkpopDataString
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#39;/g, "'");

	// Find the LinkpopData JSON object
	const linkpopDataIndex = decodedData.indexOf('"LinkpopData":');
	const openBraceIndex = decodedData.indexOf('{', linkpopDataIndex);

	// Find matching closing brace
	let braceCount = 0;
	let closeBraceIndex = openBraceIndex;
	for (let i = openBraceIndex; i < decodedData.length; i++) {
		if (decodedData[i] === '{') braceCount++;
		else if (decodedData[i] === '}') {
			braceCount--;
			if (braceCount === 0) {
				closeBraceIndex = i;
				break;
			}
		}
	}

	const linkpopDataJson = decodedData.substring(openBraceIndex, closeBraceIndex + 1);

	// Parse the JSON
	let parsed;
	try {
		parsed = JSON.parse(linkpopDataJson);
	} catch {
		throw new AppError('#ERR_LINKPOP_DATA_NOT_FOUND', 400, {
			title: 'LinkPop data not found',
			detail: 'Could not extract LinkPop page data from the HTML'
		});
	}

	const page = parsed.data?.currentPage;
	if (page == null) {
		throw new AppError('#ERR_LINKPOP_DATA_NOT_FOUND', 400, {
			title: 'LinkPop data not found',
			detail: 'Could not extract LinkPop page data from the HTML'
		});
	}

	return {
		page: {
			id: page.id,
			bio: page.bio,
			title: page.title,
			slug: page.slug,
			storeUrl: page.storeUrl,
			media: page.media ? { url: page.media.url } : undefined,
			themeSettings: page.themeSettings,
			links: page.links,
			socialMediaAccounts: page.socialMediaAccounts
		}
	};
}

export async function getLinkpopDataString(html: string): Promise<string> {
	let linkPopDataString: string | null = null;
	let isInMetaTag = false;
	let currentAttributes: Record<string, string> = {};

	try {
		tokenize(
			html,
			(token: TXmlToken, stream) => {
				switch (token.type) {
					case 'ElementStart': {
						if (token.local.toLowerCase() === 'meta') {
							isInMetaTag = true;
							currentAttributes = {};
						}
						break;
					}

					case 'Attribute': {
						if (isInMetaTag) {
							currentAttributes[token.local] = token.value;
						}
						break;
					}

					case 'ElementEnd': {
						if (isInMetaTag && (token.end.type === 'Empty' || token.end.type === 'Close')) {
							const dataFlight = currentAttributes['data-flight'];
							if (dataFlight && dataFlight.includes('LinkpopData')) {
								linkPopDataString = dataFlight;
								stream.goToEnd();
							}
							isInMetaTag = false;
							currentAttributes = {};
						}
						break;
					}

					default:
						break;
				}
			},
			htmlConfig
		);
	} catch (e) {
		logger.error('Error parsing Linkpop HTML', { error: e });

		// Save the HTML to a file with timestamp in /tmp
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const filename = `linkpop-debug-${timestamp}.html`;
		const filepath = join('/tmp', filename);
		try {
			await writeFile(filepath, html, 'utf8');
			logger.info(`Saved debug HTML to ${filepath}`);
		} catch (writeError) {
			logger.error('Failed to save debug HTML', { error: writeError });
		}

		throw new AppError('#ERR_LINKPOP_DATA_NOT_FOUND', 400, {
			title: 'LinkPop data not found',
			detail: 'Could not extract LinkPop page data from the HTML'
		});
	}

	if (linkPopDataString == null) {
		throw new AppError('#ERR_LINKPOP_DATA_NOT_FOUND', 400, {
			title: 'LinkPop data not found',
			detail: 'Could not extract LinkPop page data from the HTML'
		});
	}

	return linkPopDataString;
}

export interface TLinkPopData {
	page?: {
		id: string;
		bio: string;
		title: string;
		slug: string;
		storeUrl: string;
		media?: {
			url: string;
		};
		themeSettings?: {
			backgroundColor: `#${string}`;
			backgroundStyle: string;
			backgroundImage?: {
				id: string;
				signedBlobId: string;
				url: string;
			};
			fontColor: `#${string}`;
			primaryFont: `#${string}`;
			linkCardShape: string;
			linkCardColor: `#${string}`;
			linkCardFontColor: `#${string}`;
		};
		links?: {
			__typename: string;
			id: string;
			title: string;
			url?: string;
			productId?: string;
			media?: {
				url: string;
			};
		}[];
		socialMediaAccounts?: {
			id: string;
			handle: string;
			network: string;
		}[];
	};
}
