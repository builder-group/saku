import { fetchContentType } from './fetch-content-type';

export async function fetchMimeType(url: string): Promise<string | null> {
	const contentType = await fetchContentType(url);
	return parseMimeType(contentType);
}

export function parseMimeType(contentType: string | null): string | null {
	if (contentType == null) {
		return null;
	}
	const mimeType = contentType.split(';')[0]?.trim().toLowerCase();
	return mimeType ?? null;
}
