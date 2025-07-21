export type TMatcher = (key: string, value: any) => boolean;

export const not =
	(matcher: TMatcher): TMatcher =>
	(key, value) =>
		!matcher(key, value);

export const and =
	(...matchers: TMatcher[]): TMatcher =>
	(key, value) =>
		matchers.every((matcher) => matcher(key, value));

export const or =
	(...matchers: TMatcher[]): TMatcher =>
	(key, value) =>
		matchers.some((matcher) => matcher(key, value));

export const keyContains =
	(pattern: string): TMatcher =>
	(key) =>
		key.toLowerCase().includes(pattern.toLowerCase());

export const keyMatches =
	(pattern: RegExp): TMatcher =>
	(key) =>
		pattern.test(key);

export const keyEquals =
	(exactKey: string): TMatcher =>
	(key) =>
		key === exactKey;

export const valueIsNotEmpty = (): TMatcher => (_key, value) =>
	typeof value === 'string' && value.trim() !== '';

export const valueIsValidNumber = (): TMatcher => (_key, value) => {
	if (typeof value === 'number') return true;
	if (typeof value === 'string') {
		const parsed = parseFloat(value);
		return !isNaN(parsed);
	}
	return false;
};

export const valueIsValidUrl = (): TMatcher => (_key, value) => {
	if (typeof value !== 'string') return false;
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
};

export const valueIsNotUrl = (): TMatcher => (_key, value) => {
	if (typeof value !== 'string') return false;
	try {
		new URL(value);
		return false; // It's a valid URL, so return false
	} catch {
		return true; // It's not a valid URL, so return true
	}
};

export const valueIsShopifyImageId = (): TMatcher => (_key, value) =>
	typeof value === 'string' &&
	// new format: gid://shopify/MediaImage/{id}
	(value.startsWith('gid://shopify/MediaImage/') ||
		// legacy format: shopify://shop_images/{filename}
		value.startsWith('shopify://shop_images/'));
