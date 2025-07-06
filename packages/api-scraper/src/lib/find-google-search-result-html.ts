import { htmlConfig, tokenize } from 'xml-tokenizer';

export function findGoogleSearchResultsHtml(html: string): string | null {
	let foundSearchResultsH1 = false;
	let divStart = -1;
	let divEnd = -1;
	let inH1 = false;
	let divLevel = 0;

	tokenize(
		html,
		(token, stream) => {
			if (!foundSearchResultsH1) {
				// Look for h1 with "Search Results"
				if (token.type === 'ElementStart' && token.local === 'h1') {
					inH1 = true;
				} else if (token.type === 'Text' && inH1 && token.text.includes('Search Results')) {
					foundSearchResultsH1 = true;
				} else if (
					token.type === 'ElementEnd' &&
					token.end.type === 'Close' &&
					token.end.local === 'h1'
				) {
					inH1 = false;
				}
			} else if (divStart === -1) {
				// Get the next div after the h1
				if (token.type === 'ElementStart' && token.local === 'div') {
					divStart = token.start;
					divLevel = 1;
				}
			} else {
				// Track div nesting
				if (token.type === 'ElementStart' && token.local === 'div') {
					divLevel++;
				} else if (
					token.type === 'ElementEnd' &&
					token.end.type === 'Close' &&
					token.end.local === 'div'
				) {
					divLevel--;
					if (divLevel === 0) {
						divEnd = token.range.end;
						stream.goToEnd(); // Stop processing
					}
				}
			}
		},
		htmlConfig
	);

	return divStart !== -1 && divEnd !== -1 ? html.slice(divStart, divEnd) : null;
}
