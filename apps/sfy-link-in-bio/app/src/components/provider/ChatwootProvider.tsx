import React from 'react';
import { chatwootConfig } from '@/environment';

export const ChatwootProvider: React.FC<TChatwootProviderProps> = (props) => {
	const { children, userData } = props;

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

			// Set user information if available
			if (userData && window.$chatwoot) {
				window.$chatwoot.setUser(userData.identifier, {
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

				// Set custom attributes from additionalData
				if (userData.additionalData != null) {
					window.$chatwoot.setCustomAttributes(userData.additionalData);
				}
			}
		};

		// Insert script into document head
		document.head.appendChild(script);

		return () => {
			script.parentNode?.removeChild(script);
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
