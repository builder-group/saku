import { fetchClient } from '../environment';

export async function fetchInstagramUser(username: string): Promise<TInstagramUser | null> {
	const result = await fetchClient.proxyGet(
		'https://i.instagram.com/api/v1/users/web_profile_info',
		{
			queryParams: {
				username
			},
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'x-ig-app-id': '936619743392459'
			}
		}
	);
	if (result.isErr()) {
		return null;
	}

	const content = result.value.data.results[0]?.content;
	if (content == null || !content.length) {
		return null;
	}

	try {
		const json = JSON.parse(content) as TInstagramUserResponse;
		if (json.data.user != null) {
			return json.data.user;
		}
	} catch (error) {
		console.error('❌ Error parsing Instagram user response:', error);
	}

	return null;
}

export interface TInstagramUser {
	username: string;
	full_name?: string;
	biography: string;
	bio_links: {
		title: string;
		lynx_url?: string;
		url: string;
		link_type?: string;
	}[];
	profile_pic_url_hd?: string;
	is_private?: boolean;
	is_verified: boolean;
	external_url?: string;
	edge_followed_by?: {
		count?: number;
	};
	edge_follow?: {
		count?: number;
	};
	id?: string;
	is_business_account?: boolean;
	business_address_json?: string;
	category_name?: string;
}

interface TInstagramUserResponse {
	data: {
		user: TInstagramUser;
	};
	status: string;
}
