import { TEnforceFeatureConstraint, TFeatureDefinition } from '@blgc/types/features';
import { Err, Ok } from '@blgc/utils';
import { buildUrl, TFetchOptions, type TFetchClient, type TFetchResponse } from 'feature-fetch';

export interface TOxylabsFeature {
	key: 'oxylabs';
	api: {
		proxyGet: (
			path: string,
			options?: TOxylabsProxyOptions
		) => Promise<TFetchResponse<TOxylabsResponse, unknown, 'json'>>;
	};
}

// https://developers.oxylabs.io/scraping-solutions/web-scraper-api
// https://dashboard.oxylabs.io/en/api-playground
export function withOxylabs<GFeatures extends TFeatureDefinition[]>(
	baseFetchClient: TEnforceFeatureConstraint<TFetchClient<GFeatures>, TFetchClient<GFeatures>, []>,
	config: TOxylabsConfig
): TFetchClient<[TOxylabsFeature, ...GFeatures]> {
	const { username, password, endpoint = 'https://realtime.oxylabs.io/v1/queries', debug } = config;
	const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

	if (debug) {
		console.log('🔍 Oxylabs config:', {
			username,
			endpoint,
			debug
		});
	}

	const oxylabsFeature: TOxylabsFeature['api'] = {
		async proxyGet(
			this: TFetchClient<[]>,
			path: string,
			options: TOxylabsProxyOptions = {}
		): Promise<TFetchResponse<TOxylabsResponse, unknown, 'json'>> {
			const {
				headers = {},
				userAgentType = 'desktop_chrome',
				geoLocation = 'United States',
				render,
				parse,
				locale = 'en-us',
				context = [],
				prefixUrl = this._config.prefixUrl,
				pathSerializer = this._config.pathSerializer,
				querySerializer = this._config.querySerializer,
				pathParams = {},
				queryParams = {},
				...fetchOptions
			} = options;

			// Build context array based on provided options
			const requestContext: TOxylabsContext[] = [...context];

			// Add headers to context if we have custom headers
			if (Object.keys(headers).length > 0) {
				requestContext.push(
					{ key: 'force_headers', value: true },
					{ key: 'headers', value: headers }
				);
			}

			// Prepare the request payload according to Oxylabs API docs
			const payload: TOxylabsRequest = {
				source: 'universal',
				url: buildUrl(prefixUrl, {
					path,
					pathParams,
					queryParams,
					pathSerializer,
					querySerializer
				}),
				...(userAgentType != null && { user_agent_type: userAgentType }),
				...(geoLocation != null && { geo_location: geoLocation }),
				...(locale != null && { locale }),
				...(parse != null && { parse }),
				...(render != null && { render }),
				...(requestContext.length > 0 && { context: requestContext })
			};

			if (debug) {
				console.log('🔍 Oxylabs request payload:', JSON.stringify(payload, null, 2));
			}

			// Make the request using the base fetch client
			const result = await this._baseFetch<TOxylabsResponse, unknown, 'json'>(endpoint, 'POST', {
				...fetchOptions,
				parseAs: 'json',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': authHeader
				},
				body: payload as Record<string, any>
			});
			if (result.isErr()) {
				return Err(result.error);
			}

			const response = result.value;

			if (debug) {
				console.log('🔍 Oxylabs response status:', response.response.status);
				console.log('🔍 Oxylabs response data:', response.data);
			}

			return Ok(response);
		}
	};

	// Extend the base fetch client with the oxylabs feature
	const extendedFetchClient = Object.assign(baseFetchClient, oxylabsFeature) as TFetchClient<
		[TOxylabsFeature]
	>;
	extendedFetchClient._features.push('oxylabs');

	return extendedFetchClient as unknown as TFetchClient<[TOxylabsFeature, ...GFeatures]>;
}

export interface TOxylabsConfig {
	username: string;
	password: string;
	endpoint?: string;
	debug?: boolean;
}

export interface TOxylabsRequest {
	source: 'universal';
	url: string;
	user_agent_type?: 'desktop' | 'desktop_chrome' | 'mobile' | 'mobile_android' | 'mobile_ios';
	geo_location?: 'United States' | string;
	locale?: 'en-us' | string;
	parse?: boolean;
	render?: 'html' | 'png';
	context?: TOxylabsContext[];
}

export interface TOxylabsContext {
	key: string;
	value: unknown;
}

export interface TOxylabsResponse {
	results: Array<{
		content: string;
		created_at: string;
		updated_at: string;
		page: number;
		url: string;
		job_id: string;
		status_code: number;
		parser_type?: string;
	}>;
}

export interface TOxylabsProxyOptions extends Omit<TFetchOptions<'json'>, 'parseAs'> {
	headers?: Record<string, string>;
	userAgentType?: TOxylabsRequest['user_agent_type'];
	geoLocation?: TOxylabsRequest['geo_location'];
	parse?: TOxylabsRequest['parse'];
	render?: TOxylabsRequest['render'];
	locale?: TOxylabsRequest['locale'];
	context?: TOxylabsRequest['context'];
}
