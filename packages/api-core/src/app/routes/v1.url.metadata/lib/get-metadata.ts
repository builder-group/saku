import { extractHeadMetadata, linkExtractor, metaExtractor, titleExtractor } from 'head-metadata';
import { fetchClient } from '@/environment';
import { TUrlMetadataDto } from '../schema';

export async function getMetadata(url: string): Promise<TUrlMetadataDto> {
	const metadata: TUrlMetadataDto = { url };

	// Fetch HTML
	const result = await fetchClient.get<string>(url, { parseAs: 'text' });
	if (result.isErr()) {
		return metadata;
	}
	const html = result.value.data;

	const raw = extractHeadMetadata(html, {
		meta: metaExtractor,
		title: titleExtractor,
		link: linkExtractor
	});

	// Convert all links to absolute URLs
	const links = Object.fromEntries(
		Object.entries(raw.link).map(([key, value]) => [key, toAbsoluteUrl(url, value)])
	);

	// If the icon is not found, check if favicon.ico exists
	if (links['icon'] == null) {
		const faviconUrl = toAbsoluteUrl(url, '/favicon.ico');
		const faviconCheck = await fetchClient.get(faviconUrl, { parseAs: 'text' });
		if (faviconCheck.isOk()) {
			links['icon'] = faviconUrl;
		}
	}

	return {
		url,
		title: raw.meta['og:title'] ?? raw.meta['title'] ?? raw.title,
		description: raw.meta['og:description'] ?? raw.meta['description'],
		site: { name: raw.meta['og:site_name'] },
		media: {
			image: raw.meta['og:image'],
			video: raw.meta['og:video'],
			audio: raw.meta['og:audio']
		},
		icons: {
			favicon: links['icon'],
			touch: links['apple-touch-icon'] ?? links['icon'],
			mask: links['mask-icon']
		}
	};
}

function toAbsoluteUrl(baseUrl: string, path: string): string {
	try {
		// Check if it's already an absolute URL
		return new URL(path).toString();
	} catch {
		// If it fails, it's a relative URL
		try {
			const base = new URL(baseUrl);
			const absolutePath = path.startsWith('/') ? path : `/${path}`;
			return new URL(absolutePath, base).toString();
		} catch {
			// do nothing
		}
	}

	return path;
}
