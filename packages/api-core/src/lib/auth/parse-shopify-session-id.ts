export function parseShopifySessionId(sessionId: unknown): TSessionData | null {
	if (typeof sessionId !== 'string') {
		return null;
	}

	const parts = sessionId.split('_');

	// Offline session: just the shop domain
	if (parts.length === 1) {
		const shopDomain = parts[0];

		if (shopDomain == null || shopDomain.length === 0) {
			return null;
		}

		return {
			type: 'offline',
			shopDomain
		};
	}

	// Online session: shopDomain_userId
	if (parts.length === 2) {
		const shopDomain = parts[0];
		const userId = parts[1];

		if (shopDomain == null || shopDomain.length === 0 || userId == null || userId.length === 0) {
			return null;
		}

		return {
			type: 'online',
			shopDomain,
			userId
		};
	}

	return null;
}

export type TOfflineSessionData = {
	type: 'offline';
	shopDomain: string;
};

export type TOnlineSessionData = {
	type: 'online';
	shopDomain: string;
	userId: string;
};

export type TSessionData = TOfflineSessionData | TOnlineSessionData;
