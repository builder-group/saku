import { MantleProvider as MantleProviderComponent } from '@heymantle/react';
import React from 'react';
import { logger, mantleConfig } from '@/environment';

export const MantleProvider: React.FC<TMantleProviderProps> = (props) => {
	const { children, customerApiToken } = props;

	React.useEffect(() => {
		logger.info('🧥 Initializing Mantle...', {
			appId: mantleConfig.appId,
			customerApiToken
		});
	}, [customerApiToken]);

	return (
		<MantleProviderComponent appId={mantleConfig.appId} customerApiToken={customerApiToken}>
			{children}
		</MantleProviderComponent>
	);
};

interface TMantleProviderProps {
	children: React.ReactNode;
	customerApiToken: string;
}
