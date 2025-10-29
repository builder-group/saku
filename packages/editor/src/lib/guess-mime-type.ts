import { parseUrl } from './parse-url';

/**
 * Guesses MIME type from URL or filename by checking the file extension.
 *
 * Note: We use this instead of e.g. fetching Content-Type headers because most external URLs block CORS requests, making it hard to fetch headers (on the frontend).
 */
export function guessMimeType(urlOrFileName: string): string | null {
	const url = parseUrl(urlOrFileName);
	if (url != null) {
		return guessMimeTypeFromUrl(url);
	}
	return guessMimeTypeFromFileName(urlOrFileName);
}

export function guessMimeTypeFromUrl(url: URL): string | null {
	const pathname = url.pathname;
	const lastSlashIndex = pathname.lastIndexOf('/');
	const fileName = lastSlashIndex !== -1 ? pathname.slice(lastSlashIndex + 1) : pathname;
	return guessMimeTypeFromFileName(fileName);
}

export function guessMimeTypeFromFileName(fileName: string): string | null {
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1 || lastDotIndex >= fileName.length - 1) {
		return null;
	}

	const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
	switch (extension) {
		// Images
		case 'png':
			return 'image/png';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
		case 'webp':
			return 'image/webp';
		case 'svg':
			return 'image/svg+xml';
		case 'ico':
			return 'image/x-icon';
		// Fonts
		case 'woff':
			return 'font/woff';
		case 'woff2':
			return 'font/woff2';
		case 'ttf':
			return 'font/ttf';
		case 'otf':
			return 'font/otf';
		// Videos
		case 'mp4':
			return 'video/mp4';
		case 'webm':
			return 'video/webm';
		case 'mov':
			return 'video/quicktime';
		case 'avi':
			return 'video/x-msvideo';
		case 'mkv':
			return 'video/x-matroska';
		default:
			return null;
	}
}
