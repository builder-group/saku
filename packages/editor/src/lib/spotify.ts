import { TSpotifyEmbedContentType } from '../types';
import { parseUrl } from './parse-url';

export function extractSpotifyId(
	url: string
): { type: TSpotifyEmbedContentType; id: string } | null {
	const urlObj = parseUrl(url);
	if (urlObj == null) {
		return null;
	}

	// Handle open.spotify.com URLs
	if (urlObj.hostname === 'open.spotify.com') {
		const pathParts = urlObj.pathname.split('/').filter(Boolean);

		if (pathParts.length >= 2) {
			const type = pathParts[0] as 'track' | 'album' | 'playlist' | 'artist';
			const id = pathParts[1];

			if (['track', 'album', 'playlist', 'artist'].includes(type) && id) {
				return { type, id };
			}
		}
	}

	return null;
}

export function createSpotifyEmbedUrl(type: TSpotifyEmbedContentType, id: string): string {
	return `https://open.spotify.com/embed/${type}/${id}`;
}

export function createSpotifyUrl(type: TSpotifyEmbedContentType, id: string): string {
	return `https://open.spotify.com/${type}/${id}`;
}
