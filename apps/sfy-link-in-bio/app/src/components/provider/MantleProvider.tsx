import { MantleProvider as MantleProviderComponent } from '@heymantle/react';
import React from 'react';
import { logger, mantleConfig } from '@/environment';

export const MantleProvider: React.FC<TMantleProviderProps> = (props) => {
	const { children, customerApiToken, disabled = false } = props;

	React.useEffect(() => {
		if (disabled) {
			logger.info('🧥 Skipping Mantle initialization');
			return;
		}

		logger.info('🧥 Initializing Mantle...', {
			appId: mantleConfig.appId,
			customerApiToken
		});
	}, [customerApiToken, disabled]);

	if (disabled) {
		return children;
	}

	return (
		<MantleProviderComponent appId={mantleConfig.appId} customerApiToken={customerApiToken}>
			{children}
		</MantleProviderComponent>
	);
};

interface TMantleProviderProps {
	children: React.ReactNode;
	customerApiToken: string;
	disabled?: boolean;
}
