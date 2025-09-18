export function createShopifySessionId(shopDomain: string, userId?: string): string {
	if (userId) {
		return `${shopDomain}_${userId}`;
	}
	return `offline_${shopDomain}`;
}
