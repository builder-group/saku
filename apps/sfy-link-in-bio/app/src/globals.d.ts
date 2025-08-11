import '@shopify/shopify-api';

declare module '*.css';

declare module '@shopify/shopify-api' {
	interface Session {
		additionalData?: {
			mantleApiToken?: string;
		};
	}
}

declare global {
	interface Window {
		chatwootSDK?: {
			run: (config: { websiteToken: string; baseUrl: string }) => void;
		};
		chatwootSettings?: Record<string, unknown>;
	}
}
