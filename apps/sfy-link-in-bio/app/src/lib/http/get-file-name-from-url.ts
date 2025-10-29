import { parseUrl } from '@repo/editor';

export function getFileNameFromUrl(url: string): string | null {
	const pathname = parseUrl(url)?.pathname;
	if (pathname == null) {
		return null;
	}
	return pathname.split('/').pop() ?? null;
}
