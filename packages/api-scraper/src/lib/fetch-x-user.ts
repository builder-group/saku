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
			const resetTime = result.error.response.headers.get('x-rate-limit-reset');
			const limit = result.error.response.headers.get('x-rate-limit-limit');
			console.warn('⚠️ X API Rate limited:', {
				limit,
				resetTime: resetTime ? new Date(Number(resetTime) * 1000).toISOString() : 'unknown',
				username
			});
			return null;
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
