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

/**
 * Parses a Shopify session ID to extract session type and relevant data
 *
 * @param sessionId - The session ID to parse
 * @returns Session data with type and extracted information, or null if invalid
 *
 * @example
 * // Offline session (just shop domain)
 * parseSessionId('my-shop.myshopify.com')
 * // Returns: { type: 'offline', shopDomain: 'my-shop.myshopify.com' }
 *
 * // Online session (shop domain + user ID)
 * parseSessionId('my-shop.myshopify.com_987654321')
 * // Returns: { type: 'online', shopDomain: 'my-shop.myshopify.com', userId: '987654321' }
 *
 * // Invalid session
 * parseSessionId('invalid_session_format_too_many_parts')
 * // Returns: null
 */
export function parseSessionId(sessionId: unknown): TSessionData | null {
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
