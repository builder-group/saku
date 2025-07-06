import fs from 'node:fs';
import path from 'node:path';
import { createObjectHash } from './create-object-hash';
import { fetchInstagramUser, type TInstagramUser } from './fetch-instagram-user';

export async function fetchInstagramUsers(
	usernames: string[],
	config: TFetchInstagramUsersConfig
): Promise<TFetchInstagramUsersResult> {
	const { outputDir, useCache = false, delayBetweenRequests = 500 } = config;

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const users: TInstagramUserResult[] = [];
	console.log(`🔍 Fetching ${usernames.length} Instagram users...`);

	for (let i = 0; i < usernames.length; i++) {
		const username = usernames[i];
		if (!username?.length) {
			console.log(`⚠️ Skipping empty username at index ${i}`);
			continue;
		}

		const userQueryParams: TInstagramUserQueryParams = {
			username
		};

		const hash = createObjectHash(userQueryParams, 8);
		const fileName = `instagram-${hash}.json`;
		const filePath = path.join(outputDir, fileName);

		// Check cache first if enabled
		if (useCache && fs.existsSync(filePath)) {
			let userData: TInstagramUserData | null = null;
			try {
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				userData = JSON.parse(fileContent) as TInstagramUserData;
			} catch (error) {
				console.log(`⚠️  Cache data invalid for ${fileName}, refetching...`);
			}

			if (userData != null) {
				console.log(`📂 Using cached user from ${userData.metadata.timestamp}`);
				users.push({
					status: 'success',
					filePath,
					cached: true
				} satisfies TSuccessInstagramUserResult);
				continue;
			}
		}

		console.log(`📄 Fetching user for @${username}...`);

		const user = await fetchInstagramUser(username);
		if (user == null) {
			const errorMsg = `Failed to fetch user for @${username}`;
			console.error(`❌ ${errorMsg}`);
			users.push({
				status: 'error',
				query: userQueryParams,
				error: errorMsg
			} satisfies TErrorInstagramUserResult);
			continue;
		}

		const timestamp = new Date().toISOString();
		const userData: TInstagramUserData = {
			user,
			metadata: {
				query: userQueryParams,
				timestamp
			}
		};

		// Save the user data
		try {
			fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf-8');
		} catch (error) {
			const errorMsg = `Failed to save user: ${error}`;
			console.error(`❌ ${errorMsg}`);
			users.push({
				status: 'error',
				query: userQueryParams,
				error: errorMsg
			} satisfies TErrorInstagramUserResult);
			continue;
		}

		users.push({
			status: 'success',
			filePath,
			cached: false
		} satisfies TSuccessInstagramUserResult);

		console.log(`✅ User saved as ${fileName}`);

		// Add delay between requests to avoid rate limiting
		if (i < usernames.length - 1) {
			console.log(`⏱️  Waiting ${delayBetweenRequests}ms before next request...`);
			await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
		}
	}

	const successfulUsers = users.filter((p) => p.status === 'success');
	const failedUsers = users.filter((p) => p.status === 'error');

	console.log(
		`🎉 Completed: ${successfulUsers.length}/${successfulUsers.length + failedUsers.length} users fetched successfully`
	);
	if (failedUsers.length > 0) {
		console.log(`❌ Failed: ${failedUsers.length} users had errors`);
	}

	return {
		users,
		timestamp: new Date().toISOString()
	};
}

export interface TFetchInstagramUsersConfig {
	outputDir: string;
	useCache?: boolean;
	delayBetweenRequests?: number;
}

export interface TInstagramUserQueryParams extends Record<string, string> {
	username: string;
}

export interface TInstagramUserData {
	user: TInstagramUser;
	metadata: {
		query: TInstagramUserQueryParams;
		timestamp: string;
	};
}

export interface TFetchInstagramUsersResult {
	users: TInstagramUserResult[];
	timestamp: string;
}

export type TInstagramUserResult = TSuccessInstagramUserResult | TErrorInstagramUserResult;

export interface TSuccessInstagramUserResult {
	status: 'success';
	filePath: string;
	cached: boolean;
}

export interface TErrorInstagramUserResult {
	status: 'error';
	query: TInstagramUserQueryParams;
	error: string;
}
