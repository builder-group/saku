import { fetchClient } from '../../environment';

// https://stackoverflow.com/questions/38235715/fetch-reject-promise-and-catch-the-error-if-status-is-not-ok
export async function fetchContentType(url: string): Promise<string | null> {
	// Try HEAD request first (most efficient - only gets headers)
	const headResult = await fetchClient._baseFetch(url, 'HEAD', {
		fetchProps: {
			redirect: 'follow'
		}
	});
	if (headResult.isOk()) {
		return headResult.value.response.headers.get('Content-Type');
	}

	// If HEAD fails (some servers don't support it), try GET with range request
	const getResult = await fetchClient.get(url, {
		headers: { Range: 'bytes=0-0' },
		fetchProps: {
			redirect: 'follow'
		}
	});
	if (getResult.isOk()) {
		return getResult.value.response.headers.get('Content-Type');
	}

	return null;
}
