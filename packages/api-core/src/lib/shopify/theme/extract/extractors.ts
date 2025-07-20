import { extractUsername, mapFont, TMapper, toNumber, trim } from './mappers';
import { keyEquals, keyMatches, TMatcher, valueIsNotEmpty, valueIsValidNumber } from './matchers';

export function extract<T>(
	obj: Record<string, any>,
	matchers: TMatcher[],
	mappers: TMapper<T>[]
): T | undefined {
	for (const [key, value] of Object.entries(obj)) {
		if (matchers.every((matcher) => matcher(key, value))) {
			for (const mapper of mappers) {
				const result = mapper(key, value);
				if (result != null) {
					return result;
				}
			}
		}
	}
	return undefined;
}

export function extractString(obj: Record<string, any>, fieldNames: string[]): string | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(obj, [keyEquals(fieldName), valueIsNotEmpty()], [trim()]);
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

export function extractNumber(obj: Record<string, any>, fieldNames: string[]): number | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(obj, [keyEquals(fieldName), valueIsValidNumber()], [toNumber()]);
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

export function extractFont(
	obj: Record<string, any>,
	fieldNames: string[]
): { family: string; weight: number; style: string } | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(obj, [keyEquals(fieldName), valueIsNotEmpty()], [mapFont()]);
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

export function extractSocialLinks(obj: Record<string, any>): TSocialLink[] {
	const socialPlatforms = [
		{ pattern: /facebook/i, platform: 'facebook', urlPattern: /facebook\.com/i },
		{ pattern: /instagram/i, platform: 'instagram', urlPattern: /instagram\.com/i },
		{ pattern: /youtube/i, platform: 'youtube', urlPattern: /youtube\.com|youtu\.be/i },
		{ pattern: /tiktok/i, platform: 'tiktok', urlPattern: /tiktok\.com/i },
		{ pattern: /twitter|x/i, platform: 'x', urlPattern: /twitter\.com|x\.com/i },
		{ pattern: /snapchat/i, platform: 'snapchat', urlPattern: /snapchat\.com/i },
		{ pattern: /pinterest/i, platform: 'pinterest', urlPattern: /pinterest\.com/i },
		{ pattern: /linkedin/i, platform: 'linkedin', urlPattern: /linkedin\.com/i }
	];

	const socialLinks: TSocialLink[] = [];

	for (const { pattern, platform, urlPattern } of socialPlatforms) {
		const url = extract(obj, [keyMatches(pattern), valueIsNotEmpty()], [trim()]);
		if (url && isValidUrl(url) && urlPattern.test(url)) {
			const username = extractUsername()('', url);
			socialLinks.push({ platform, url, username });
		}
	}

	return socialLinks;
}

function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export type TSocialLink = {
	platform: string;
	url: string;
	username?: string;
};
