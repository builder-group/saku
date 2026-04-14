import '@shopify/shopify-api';

declare module '*.css';

declare global {
	interface Window {
		dataLayer?: unknown[][];
		gtag?: (...args: unknown[]) => void;
		fbq?: {
			(...args: unknown[]): void;
			callMethod?: (...args: unknown[]) => void;
			queue?: unknown[][];
			loaded?: boolean;
			version?: string;
		};
	}
}

declare module '@shopify/shopify-api' {
	interface Session {
		additionalData?: {
			mantleApiToken?: string;
		};
	}
}
