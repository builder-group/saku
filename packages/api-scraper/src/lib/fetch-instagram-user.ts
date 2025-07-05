import { proxiedFetchClient, TOxylabsResponse } from '../environment';

export async function fetchInstagramUser(username: string): Promise<TInstagramUser | null> {
	const result = await proxiedFetchClient.get<TOxylabsResponse>(
		'https://i.instagram.com/api/v1/users/web_profile_info',
		{
			queryParams: {
				username
			},
			headers: {
				'x-ig-app-id': '936619743392459'
			}
		}
	);
	if (result.isErr()) {
		return null;
	}

	const content = result.value.data.results[0]?.content;
	if (content == null) {
		return null;
	}
	const json = JSON.parse(content) as TInstagramUserResponse;
	if (json.data.user == null) {
		return null;
	}

	return json.data.user;
}

interface TInstagramBioLink {
	title: string;
	lynx_url: string;
	url: string;
	link_type: string;
}

interface TInstagramUser {
	biography: string | null;
	bio_links: TInstagramBioLink[];
	ai_agent_type: string | null;
	ai_agent_owner_username: string | null;
	fb_profile_biolink: string | null;
	username: string;
	full_name: string;
	profile_pic_url: string;
	profile_pic_url_hd: string;
	is_private: boolean;
	is_verified: boolean;
	follower_count: number;
	following_count: number;
	media_count: number;
}

interface TInstagramUserResponse {
	data: {
		user: TInstagramUser;
	};
	status: string;
}
