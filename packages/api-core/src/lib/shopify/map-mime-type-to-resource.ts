export function mapMimeTypeToResource(mimeType: string): 'IMAGE' | 'VIDEO' | 'FILE' {
	if (mimeType.startsWith('image/')) {
		return 'IMAGE';
	} else if (mimeType.startsWith('video/')) {
		return 'VIDEO';
	}
	return 'FILE';
}
