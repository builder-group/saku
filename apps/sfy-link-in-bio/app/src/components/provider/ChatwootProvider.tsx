import React from 'react';
import { appConfig, chatwootConfig, logger } from '@/environment';

export const ChatwootProvider: React.FC<TChatwootProviderProps> = (props) => {
	const { children, userData } = props;

	React.useEffect(() => {
		if (!appConfig.featureFlags.chatwoot) {
			logger.info('💬 Skipping Chatwoot initialization');
			return;
		}

		// Check if script is already loaded
		const existingScript = document.querySelector(`script[src="${chatwootConfig.sdkUrl}"]`);
		if (existingScript) {
			logger.info('💬 Chatwoot script already loaded, skipping initialization');
			return;
		}

		// Create script element
		const script = document.createElement('script');
		script.src = chatwootConfig.sdkUrl;
		script.defer = true;
		script.async = true;

		// Set up the Chatwoot SDK when script loads
		script.onload = () => {
			logger.info('💬 Initializing Chatwoot...', {
				websiteToken: chatwootConfig.websiteToken
			});

			window.chatwootSettings = chatwootConfig.settings;
			window.chatwootSDK?.run({
				websiteToken: chatwootConfig.websiteToken,
				baseUrl: chatwootConfig.baseUrl
			});

			window.addEventListener('chatwoot:ready', handleChatwootReady);
		};

		// Insert script into document head
		document.head.appendChild(script);

		const handleChatwootReady = () => {
			logger.info('💬 Chatwoot ready, setting user data...', {
				userData
			});

			// Set user information if available
			if (userData != null) {
				window.$chatwoot?.setUser(userData.identifier, {
					email: userData.email,
					name: userData.name,
					avatar_url: userData.avatarUrl,
					phone_number: userData.phoneNumber,
					description: userData.description,
					country_code: userData.countryCode,
					city: userData.city,
					company_name: userData.companyName,
					social_profiles: userData.socialProfiles
				});
				if (userData.additionalData != null) {
					window.$chatwoot?.setCustomAttributes(userData.additionalData);
				}
			}
		};

		return () => {
			script.parentNode?.removeChild(script);
			window.removeEventListener('chatwoot:ready', handleChatwootReady);
		};
	}, [userData]);

	return <>{children}</>;
};

interface TChatwootProviderProps {
	children: React.ReactNode;
	userData?: TChatwootUserData;
}

export interface TChatwootUserData {
	identifier: string;
	email?: string;
	name?: string;
	avatarUrl?: string;
	phoneNumber?: string;
	description?: string;
	countryCode?: string;
	city?: string;
	companyName?: string;
	socialProfiles?: {
		twitter?: string;
		linkedin?: string;
		facebook?: string;
		github?: string;
	};
	additionalData?: Record<string, unknown>;
}
