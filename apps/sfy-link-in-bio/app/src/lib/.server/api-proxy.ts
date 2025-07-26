import { logger } from '@/environment';

/**
 * Creates a proxy function that forwards requests to a target API server.
 *
 * @param config - Configuration options
 * @returns Proxy function that can handle Remix requests
 */
export function createApiProxy(config: TCreateApiProxyConfig) {
	const { targetUrl, stripPrefix } = config;

	return async function proxyRequest(request: Request): Promise<Response> {
		const requestUrl = new URL(request.url);

		// Remove the prefix from the path if specified
		let apiPath = requestUrl.pathname;
		if (stripPrefix != null) {
			apiPath = apiPath.replace(stripPrefix, '');
		}

		const urlToFetch = `${targetUrl}${apiPath}${requestUrl.search}`;
		const fetchOptions: RequestInit = {
			method: request.method,
			headers: new Headers(request.headers)
		};

		logger.info(`Proxying request to ${urlToFetch}`);

		// Add body for methods that support it
		if (request.method !== 'GET' && request.method !== 'HEAD' && request.body != null) {
			fetchOptions.body = request.body;
			// duplex: 'half' is required by Node.js undici when sending a body
			(fetchOptions as any).duplex = 'half';
		}

		try {
			return await fetch(urlToFetch, fetchOptions);
		} catch (error) {
			logger.error('Error proxying request', { error });
			return new Response(
				`Proxy Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				{
					status: 502,
					statusText: 'Bad Gateway'
				}
			);
		}
	};
}

interface TCreateApiProxyConfig {
	targetUrl: string;
	stripPrefix?: string;
}
