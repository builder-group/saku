import { TImageAsset } from '@repo/editor';

/**
 * Validates and converts a MIME type string to a supported image content type.
 * Returns null if the MIME type is not a supported image format.
 */
export function toImageContentType(
	mimeType: string | null | undefined
): TImageAsset['contentType'] | null {
	if (mimeType == null) {
		return null;
	}

	// Map to supported image types
	const normalized = mimeType.toLowerCase();
	switch (normalized) {
		case 'image/png':
			return 'image/png';
		case 'image/jpeg':
		case 'image/jpg':
			return 'image/jpeg';
		case 'image/gif':
			return 'image/gif';
		case 'image/webp':
			return 'image/webp';
		case 'image/svg+xml':
			return 'image/svg+xml';
		case 'image/x-icon':
		case 'image/vnd.microsoft.icon':
		case 'image/ico':
			return 'image/x-icon';
		default:
			return null;
	}
}
