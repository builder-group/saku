import { TYouTubeEmbedContentType } from '../types';
import { parseUrl } from './parse-url';

export function extractYouTubeId(
	url: string
): { type: TYouTubeEmbedContentType; id: string } | null {
	const urlObj = parseUrl(url);
	if (urlObj == null) {
		return null;
	}

	// Handle youtube.com/watch?v=VIDEO_ID
	if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
		const videoId = urlObj.searchParams.get('v');
		if (videoId != null) {
			return { type: 'video', id: videoId };
		}
	}

	// Handle youtu.be/VIDEO_ID
	if (urlObj.hostname === 'youtu.be') {
		const videoId = urlObj.pathname.slice(1); // Remove leading '/'
		if (videoId != null) {
			return { type: 'video', id: videoId };
		}
	}

	// Handle youtube.com/playlist?list=PLAYLIST_ID
	if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/playlist') {
		const playlistId = urlObj.searchParams.get('list');
		if (playlistId != null) {
			return { type: 'playlist', id: playlistId };
		}
	}

	return null;
}

export function createYouTubeEmbedUrl(type: TYouTubeEmbedContentType, id: string): string {
	switch (type) {
		case 'video':
			return `https://www.youtube.com/embed/${id}`;
		case 'playlist':
			return `https://www.youtube.com/embed/videoseries?list=${id}`;
	}
}

export function createYouTubeUrl(type: TYouTubeEmbedContentType, id: string): string {
	switch (type) {
		case 'video':
			return `https://www.youtube.com/watch?v=${id}`;
		case 'playlist':
			return `https://www.youtube.com/playlist?list=${id}`;
	}
}
