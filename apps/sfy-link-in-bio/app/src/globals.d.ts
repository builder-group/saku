import '@shopify/shopify-api';

declare module '*.css';

declare module '@shopify/shopify-api' {
	interface Session {
		additionalData?: {
			mantleApiToken?: string | null;
		};
	}
}
