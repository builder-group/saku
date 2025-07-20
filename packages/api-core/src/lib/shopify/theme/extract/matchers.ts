export type TMatcher = (key: string, value: any) => boolean;

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
