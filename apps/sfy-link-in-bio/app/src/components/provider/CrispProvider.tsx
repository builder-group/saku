import { Crisp } from 'crisp-sdk-web';
import React from 'react';
import { appConfig, crispConfig, logger } from '@/environment';

export const CrispProvider: React.FC<TCrispProviderProps> = (props) => {
	const { children, user } = props;

	React.useEffect(() => {
		if (!appConfig.featureFlags.crisp) {
			logger.info('💬 Skipping Crisp initialization');
			return;
		}

		logger.info('💬 Initializing Crisp...', {
			websiteToken: crispConfig.websiteToken
		});

		Crisp.configure(crispConfig.websiteToken);
		if (user != null) {
			if (user.email != null) {
				Crisp.user.setEmail(user.email);
			}
			if (user.name != null) {
				Crisp.user.setNickname(user.name);
			}
			if (user.avatarUrl != null) {
				Crisp.user.setAvatar(user.avatarUrl);
			}
			if (user.additionalData != null) {
				Crisp.session.setData(user.additionalData);
			}
		}
	}, [user]);

	return <>{children}</>;
};

interface TCrispProviderProps {
	children: React.ReactNode;
	user: {
		identifier: string;
		email?: string;
		name?: string;
		avatarUrl?: string;
		additionalData?: Record<string, unknown>;
	};
}
