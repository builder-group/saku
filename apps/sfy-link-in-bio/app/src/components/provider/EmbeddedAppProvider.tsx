import { MantleProvider } from '@heymantle/react';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import { I18n } from '@shopify/polaris/build/ts/src/utilities/i18n';
import {
	LinkLikeComponent,
	LinkLikeComponentProps
} from '@shopify/polaris/build/ts/src/utilities/link';
import { AppProvider } from '@shopify/shopify-app-react-router/react';
import React from 'react';
import { Link } from 'react-router';
import { logger, mantleConfig } from '@/environment';
import { ChatwootProvider } from './ChatwootProvider';

export const EmbeddedAppProvider: React.FC<TEmbeddedAppProviderProps> = (props) => {
	const { shopifyApiKey, mantleApiToken = '', children, i18n } = props;

	React.useEffect(() => {
		logger.info('🧥 Initializing Mantle...', {
			appId: mantleConfig.appId,
			customerApiToken: mantleApiToken
		});
	}, [mantleApiToken]);

	return (
		<AppProvider embedded apiKey={shopifyApiKey}>
			<PolarisAppProvider linkComponent={PolarisLink} i18n={i18n}>
				<MantleProvider appId={mantleConfig.appId} customerApiToken={mantleApiToken}>
					<ChatwootProvider>{children}</ChatwootProvider>
				</MantleProvider>
			</PolarisAppProvider>
		</AppProvider>
	);
};

interface TEmbeddedAppProviderProps {
	shopifyApiKey: string;
	mantleApiToken?: string;
	children: React.ReactNode;
	i18n: TEmbeddedAppProviderI18n;
}

export type TEmbeddedAppProviderI18n = ConstructorParameters<typeof I18n>[0];

const PolarisLink = React.forwardRef<HTMLAnchorElement, LinkLikeComponentProps>((props, ref) => (
	<Link {...props} to={props.url ?? props['to']} ref={ref} />
)) as LinkLikeComponent;
PolarisLink.displayName = 'PolarisLink';
