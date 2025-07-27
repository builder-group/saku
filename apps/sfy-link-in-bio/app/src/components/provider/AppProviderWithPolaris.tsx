import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import { I18n } from '@shopify/polaris/build/ts/src/utilities/i18n';
import {
	LinkLikeComponent,
	LinkLikeComponentProps
} from '@shopify/polaris/build/ts/src/utilities/link';
import { AppProvider } from '@shopify/shopify-app-react-router/react';
import React from 'react';
import { Link } from 'react-router';

export const AppProviderWithPolaris: React.FC<TAppProviderWithPolarisProps> = (props) => {
	const { apiKey, children, i18n } = props;

	return (
		<AppProvider embedded apiKey={apiKey}>
			<PolarisAppProvider linkComponent={PolarisLink} i18n={i18n}>
				{children}
			</PolarisAppProvider>
		</AppProvider>
	);
};

interface TAppProviderWithPolarisProps {
	apiKey: string;
	children: React.ReactNode;
	i18n: TShopifyAppProviderI18n;
}

export type TShopifyAppProviderI18n = ConstructorParameters<typeof I18n>[0];

const PolarisLink = React.forwardRef<HTMLAnchorElement, LinkLikeComponentProps>((props, ref) => (
	<Link {...props} to={props.url ?? props['to']} ref={ref} />
)) as LinkLikeComponent;
PolarisLink.displayName = 'PolarisLink';
