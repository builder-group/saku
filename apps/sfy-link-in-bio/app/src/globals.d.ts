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
		$chatwoot?: {
			setUser: (identifier: string, userData: Record<string, unknown>) => void;
			setCustomAttributes: (attributes: Record<string, unknown>) => void;
			toggle: (state?: 'open' | 'close') => void;
			popoutChatWindow: () => void;
			toggleBubbleVisibility: (state: 'show' | 'hide') => void;
		};
	}
}
