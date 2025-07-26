import { ApiVersion } from '@shopify/shopify-api';

const apiVersion = ApiVersion.July25;

export const shopifyClientConfig = {
	shop: {
		storefrontApi: (shopId: string) => `https://${shopId}/api/${apiVersion}/graphql.json`
	}
};
