import { RequestError } from 'feature-fetch';
import { xFetchClient } from '../environment';

// https://docs.x.com/x-api/users/user-lookup-by-username
// Rate limits (Free tier):
// - 3 requests / 15 mins PER APP
// - 96 requests / 24 hours PER APP
export async function fetchXUser(username: string): Promise<TXUser | null> {
	const result = await xFetchClient.get<TXUserResponse>(`/users/by/username/${username}`, {
		queryParams: {
			'user.fields': [
				'description',
				'entities',
				'id',
				'name',
				'profile_image_url',
				'protected',
				'public_metrics',
				'url',
				'username',
				'verified'
			].join(',')
		}
	});

	if (result.isErr()) {
		if (result.error instanceof RequestError && result.error.response?.status === 429) {
			const headers = result.error.response.headers;

			// Check 24h app limit
			const appLimit24hRemaining = Number(headers.get('x-app-limit-24hour-remaining'));
			const appLimit24hReset = Number(headers.get('x-app-limit-24hour-reset'));
			if (appLimit24hRemaining === 0) {
				const resetDate = new Date(appLimit24hReset * 1000);
				console.warn('⚠️ X API 24h App Rate limit reached:', {
					username,
					resetTime: resetDate.toLocaleString(),
					remaining: appLimit24hRemaining
				});
				return null;
			}

			// Handle 15min app limit
			const appLimitReset = Number(headers.get('x-rate-limit-reset'));
			const timeTillReset = appLimitReset * 1000 - Date.now();

			console.warn('⚠️ X API 15min App Rate limit reached:', {
				username,
				resetTime: new Date(appLimitReset * 1000).toLocaleString(),
				remaining: headers.get('x-rate-limit-remaining')
			});

			if (timeTillReset > 0) {
				console.log(
					'⏳ Waiting for app rate limit reset until:',
					new Date(Date.now() + timeTillReset).toLocaleString()
				);
				await new Promise((resolve) => setTimeout(resolve, timeTillReset));
				return fetchXUser(username);
			}
		}

		console.error('❌ Error fetching X user:', result.error);
		return null;
	}

	return result.value.data.data;
}

export interface TXUser {
	id: string;
	name: string;
	username: string;
	description: string;
	url?: string;
	profile_image_url: string;
	protected: boolean;
	verified: boolean;
	entities?: {
		url?: {
			urls: Array<{
				start: number;
				end: number;
				url: string;
				expanded_url: string;
				display_url: string;
			}>;
		};
		description?: {
			urls: Array<{
				start: number;
				end: number;
				url: string;
				expanded_url: string;
				display_url: string;
			}>;
		};
	};
	public_metrics: {
		followers_count: number;
		following_count: number;
		tweet_count: number;
		listed_count: number;
	};
}

interface TXUserResponse {
	data: TXUser;
}
