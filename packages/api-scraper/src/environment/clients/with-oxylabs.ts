import { type TFetchLike, type TRequestMiddleware } from 'feature-fetch';

export function withOxylabs(config: TOxylabsConfig): TRequestMiddleware {
	const { username, password, endpoint = 'https://realtime.oxylabs.io/v1/queries', debug } = config;
	const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

	console.log('🔍 Oxylabs config:', {
		username,
		password,
		endpoint,
		debug
	});

	return (next: TFetchLike) => {
		return async (url: string | URL, init?: RequestInit) => {
			// Prepare Oxylabs request body
			const oxyRequest: TOxylabsRequest = {
				source: 'universal',
				url: url.toString(),
				force_headers: true,
				headers: init?.headers != null ? Object.fromEntries(new Headers(init.headers)) : {}
			};

			// Let Oxylabs handle the content-type
			delete oxyRequest.headers['content-type'];

			// If original request had a body, include it base64 encoded
			if (init?.body != null) {
				oxyRequest.body = Buffer.from(init.body.toString()).toString('base64');
				oxyRequest.method = init?.method;
			}

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
					data: data
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
	force_headers: boolean;
	headers: Record<string, string>;
	body?: string;
	method?: string;
}

export interface TOxylabsResult {
	content: string;
}

export interface TOxylabsResponse {
	results: TOxylabsResult[];
}
