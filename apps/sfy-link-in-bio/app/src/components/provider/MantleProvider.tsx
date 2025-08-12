import { MantleProvider as MantleProviderComponent } from '@heymantle/react';
import React from 'react';
import { appConfig, logger, mantleConfig } from '@/environment';

export const MantleProvider: React.FC<TMantleProviderProps> = (props) => {
	const { children, customerApiToken } = props;

	React.useEffect(() => {
		if (!appConfig.featureFlags.mantle) {
			logger.info('🧥 Skipping Mantle initialization');
			return;
		}

		logger.info('🧥 Initializing Mantle...', {
			appId: mantleConfig.appId,
			customerApiToken
		});
	}, [customerApiToken]);

	return appConfig.featureFlags.mantle ? (
		<MantleProviderComponent appId={mantleConfig.appId} customerApiToken={customerApiToken}>
			{children}
		</MantleProviderComponent>
	) : (
		children
	);
};

interface TMantleProviderProps {
	children: React.ReactNode;
	customerApiToken: string;
}
