export function extractYouTubeVideoId(url: string): string | null {
	try {
		const urlObj = new URL(url);

		// Handle youtube.com/watch?v=VIDEO_ID
		if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
			return urlObj.searchParams.get('v');
		}

		// Handle youtu.be/VIDEO_ID
		if (urlObj.hostname === 'youtu.be') {
			return urlObj.pathname.slice(1); // Remove leading '/'
		}
	} catch {
		// do nothing
	}

	return null;
}
