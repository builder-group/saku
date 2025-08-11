import React from 'react';
import { chatwootConfig } from '@/environment';

export const ChatwootProvider: React.FC<TChatwootProviderProps> = (props) => {
	const { children } = props;

	React.useEffect(() => {
		// Create script element
		const script = document.createElement('script');
		script.src = chatwootConfig.sdkUrl;
		script.defer = true;
		script.async = true;

		// Set up the Chatwoot SDK when script loads
		script.onload = () => {
			window.chatwootSettings = chatwootConfig.settings;
			window.chatwootSDK?.run({
				websiteToken: chatwootConfig.websiteToken,
				baseUrl: chatwootConfig.baseUrl
			});
		};

		// Insert script into document head
		document.head.appendChild(script);

		return () => {
			script.parentNode?.removeChild(script);
		};
	}, []);

	return <>{children}</>;
};

interface TChatwootProviderProps {
	children: React.ReactNode;
}
