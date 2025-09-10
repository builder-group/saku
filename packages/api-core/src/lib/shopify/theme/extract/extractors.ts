import { getFileById, searchFileByFilename } from '../../../gql';
import { mapFont, TMapper, toNumber, trim } from './mappers';
import {
	and,
	keyEquals,
	keyMatches,
	not,
	TMatcher,
	valueIsNotEmpty,
	valueIsShopifyImageId,
	valueIsValidNumber,
	valueIsValidUrl
} from './matchers';

export function extract<T>(
	obj: Record<string, any>,
	matcher: TMatcher,
	mapper: TMapper<T>
): T | undefined {
	return traverseObject(obj, matcher, mapper);
}

function traverseObject<T>(
	obj: Record<string, any>,
	matcher: TMatcher,
	mapper: TMapper<T>,
	path: string = ''
): T | undefined {
	for (const [key, value] of Object.entries(obj)) {
		const fullPath = path.length > 0 ? `${path}.${key}` : key;

		if (matcher(fullPath, value)) {
			const result = mapper(fullPath, value);
			if (result != null) {
				return result;
			}
		}

		// Recursively traverse nested objects
		if (value != null && typeof value === 'object' && !Array.isArray(value)) {
			const nestedResult = traverseObject(value, matcher, mapper, fullPath);
			if (nestedResult != null) {
				return nestedResult;
			}
		}
	}

	return undefined;
}

export function extractString(obj: Record<string, any>, fieldNames: string[]): string | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(obj, and(keyEquals(fieldName), valueIsNotEmpty()), trim());
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

export function extractNumber(obj: Record<string, any>, fieldNames: string[]): number | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(obj, and(keyEquals(fieldName), valueIsValidNumber()), toNumber());
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
		const value = extract(obj, and(keyEquals(fieldName), valueIsNotEmpty()), mapFont());
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

const SOCIAL_PLATFORMS = [
	{
		name: 'facebook',
		platform: 'facebook',
		url: (handle: string) => `https://facebook.com/${handle}`
	},
	{
		name: 'instagram',
		platform: 'instagram',
		url: (handle: string) => `https://instagram.com/${handle}`
	},
	{
		name: 'youtube',
		platform: 'youtube',
		url: (handle: string) => `https://youtube.com/@${handle}`
	},
	{ name: 'tiktok', platform: 'tiktok', url: (handle: string) => `https://tiktok.com/@${handle}` },
	{ name: 'twitter', platform: 'x', url: (handle: string) => `https://twitter.com/${handle}` },
	{ name: 'x', platform: 'x', url: (handle: string) => `https://twitter.com/${handle}` },
	{
		name: 'snapchat',
		platform: 'snapchat',
		url: (handle: string) => `https://snapchat.com/add/${handle}`
	},
	{
		name: 'pinterest',
		platform: 'pinterest',
		url: (handle: string) => `https://pinterest.com/${handle}`
	},
	{
		name: 'linkedin',
		platform: 'linkedin',
		url: (handle: string) => `https://linkedin.com/in/${handle}`
	},
	{
		name: 'patreon',
		platform: 'patreon',
		url: (handle: string) => `https://patreon.com/${handle}`
	}
] as const;

export function extractSocialLinks(obj: Record<string, any>): TSocialLink[] {
	const socialLinks: TSocialLink[] = [];

	for (const { name, platform, url } of SOCIAL_PLATFORMS) {
		// Match platform name not surrounded by letters/numbers, and value is not a URL
		const pattern = new RegExp(`(?<![a-zA-Z0-9])${name}(?![a-zA-Z0-9])`, 'i');

		const value = extract(
			obj,
			and(keyMatches(pattern), valueIsNotEmpty(), not(valueIsValidUrl())),
			trim()
		);
		if (value != null) {
			socialLinks.push({
				platform,
				url: url(value),
				username: value
			});
		}
	}

	return socialLinks;
}

export function extractUrl(obj: Record<string, any>, fieldNames: string[]): string | undefined {
	for (const fieldName of fieldNames) {
		const value = extract(
			obj,
			and(keyEquals(fieldName), valueIsNotEmpty(), valueIsValidUrl()),
			trim()
		);
		if (value != null) {
			return value;
		}
	}
	return undefined;
}

export async function extractShopifyImageUrl(
	obj: Record<string, any>,
	fieldNames: string[],
	config: { shopId: string; accessToken: string }
): Promise<string | undefined> {
	for (const fieldName of fieldNames) {
		const value = extract(
			obj,
			and(keyEquals(fieldName), valueIsNotEmpty(), valueIsShopifyImageId()),
			trim()
		);
		if (value == null) {
			continue;
		}

		// Handle legacy format: shopify://shop_images/{filename}
		if (value.startsWith('shopify://shop_images/')) {
			const filename = value.replace('shopify://shop_images/', '');
			const result = await searchFileByFilename(filename, config);
			if (result.isOk()) {
				return result.value.url;
			}
		}
		// Handle new format: gid://shopify/MediaImage/{id}
		else if (value.startsWith('gid://shopify/')) {
			const result = await getFileById(value, config);
			if (result.isOk()) {
				return result.value.url;
			}
		}
	}

	return undefined;
}

export type TSocialLink = {
	platform: string;
	url: string;
	username?: string;
};
