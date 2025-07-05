import { type TFetchLike, type TRequestMiddleware } from 'feature-fetch';

export function withOxylabs(config: TOxylabsConfig): TRequestMiddleware {
	const { username, password, endpoint = 'https://realtime.oxylabs.io/v1/queries', debug } = config;
	const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

	return (next: TFetchLike) => {
		return async (url: string | URL, init?: RequestInit) => {
			// Convert headers to object if present
			const customHeaders =
				init?.headers != null
					? Object.fromEntries(
							// Let content-type be handled by Oxylabs
							Object.entries(Object.fromEntries(new Headers(init.headers))).filter(
								([key]) => key.toLowerCase() !== 'content-type'
							)
						)
					: {};

			// Prepare context array with required parameters
			const context: TOxylabsContext[] = [{ key: 'user_agent_type', value: 'desktop_chrome' }];

			// Only add headers to context if we have custom headers
			if (Object.keys(customHeaders).length > 0) {
				context.push(
					{ key: 'force_headers', value: true },
					{ key: 'headers', value: customHeaders }
				);
			}

			// Add method and content if POST request
			if (init?.method?.toLowerCase() === 'post' && init?.body != null) {
				context.push(
					{ key: 'http_method', value: 'post' },
					{ key: 'content', value: Buffer.from(init.body.toString()).toString('base64') }
				);
			}

			// Prepare Oxylabs request body
			const oxyRequest: TOxylabsRequest = {
				source: 'universal',
				url: url.toString(),
				context
			};

			if (debug) {
				console.log('🔍 Sending request to Oxylabs:', {
					url: endpoint,
					request: oxyRequest
				});
			}

			// Make request to Oxylabs
			const oxyResponse = await next(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': authHeader
				},
				body: JSON.stringify(oxyRequest)
			});

			// Parse Oxylabs response
			const data = (await oxyResponse.json()) as TOxylabsResponse;
			if (debug) {
				console.log('📝 Received response from Oxylabs:', {
					status: oxyResponse.status,
					data: data.results?.[0]
				});
			}

			// Return the entire response as JSON
			return new Response(
				JSON.stringify({
					status: oxyResponse.status,
					...data
				}),
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		};
	};
}

export interface TOxylabsConfig {
	username: string;
	password: string;
	endpoint?: string;
	debug?: boolean;
}

interface TOxylabsRequest {
	source: string;
	url: string;
	context: TOxylabsContext[];
}

interface TOxylabsContext {
	key: string;
	value: unknown;
}

interface TOxylabsResponse {
	results: TOxylabsResult[];
	job: Record<string, unknown>;
}

export interface TOxylabsResult {
	content: string;
	url: string;
	status_code: number;
}

export interface TOxylabMiddlewareResponse extends TOxylabsResponse {
	status: number;
}
