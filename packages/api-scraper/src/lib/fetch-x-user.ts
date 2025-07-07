import { RequestError } from 'feature-fetch';
import { xFetchClient } from '../environment';

// https://docs.x.com/x-api/users/user-lookup-by-username
// Rate limits (Free tier):
// - 3 requests / 15 mins PER USER
// - 3 requests / 15 mins PER APP
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
			console.warn('⚠️ X API Rate limited:', {
				username,
				limit: result.error.response.headers.get('x-rate-limit-limit'),
				resetTime: result.error.response.headers.get('x-rate-limit-reset'),
				remaining: result.error.response.headers.get('x-rate-limit-remaining')
			});

			const timeout = calculateRateLimitTimeout(result.error.response);
			if (timeout > 0) {
				console.log(
					'⏳ Waiting for rate limit reset until:',
					new Date(Date.now() + timeout).toLocaleString()
				);
				await new Promise((resolve) => setTimeout(resolve, timeout));
			}
			return fetchXUser(username);
		}

		console.error('❌ Error fetching X user:', result.error);
		return null;
	}

	return result.value.data.data;
}

function calculateRateLimitTimeout(response: Response): number {
	const rateLimitReset = Number(response.headers.get('x-rate-limit-reset'));
	const rateLimitRemaining = Number(response.headers.get('x-rate-limit-remaining'));
	if (rateLimitRemaining === 0) {
		const timeTillReset = rateLimitReset * 1000 - Date.now();
		return timeTillReset;
	}
	return 0;
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
