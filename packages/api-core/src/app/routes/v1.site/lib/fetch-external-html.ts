import { AppError } from '@repo/hono-utils';
import { fetchClient } from '@/environment';

export async function fetchExternalHtml(url: string): Promise<string> {
	const result = await fetchClient.get(url, {
		parseAs: 'text'
	});
	if (result.isErr()) {
		throw new AppError('#ERR_EXTERNAL_HTML', 404, {
			title: 'Unable to fetch external HTML',
			detail: `The requested external resource at ${url} could not be retrieved. It may be unavailable or returned an error.`
		});
	}

	return result.value.data;
}
