import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import { I18n } from '@shopify/polaris/build/ts/src/utilities/i18n';
import {
	LinkLikeComponent,
	LinkLikeComponentProps
} from '@shopify/polaris/build/ts/src/utilities/link';
import { AppProvider } from '@shopify/shopify-app-react-router/react';
import React from 'react';
import { Link } from 'react-router';
import { CrispProvider } from './CrispProvider';
import { MantleProvider } from './MantleProvider';

export const EmbeddedAppProvider: React.FC<TEmbeddedAppProviderProps> = (props) => {
	const {
		shopifyApiKey,
		i18n,
		mantleApiToken = '',
		userContext,
		children,
		disabledCrisp,
		disabledCrispCallbacks,
		disabledMantle
	} = props;

	return (
		<CrispProvider
			user={userContext}
			disabled={disabledCrisp}
			disabledCallbacks={disabledCrispCallbacks}
		>
			<AppProvider embedded apiKey={shopifyApiKey}>
				<PolarisAppProvider linkComponent={PolarisLink} i18n={i18n}>
					<MantleProvider customerApiToken={mantleApiToken} disabled={disabledMantle}>
						{children}
					</MantleProvider>
				</PolarisAppProvider>
			</AppProvider>
		</CrispProvider>
	);
};

interface TEmbeddedAppProviderProps {
	shopifyApiKey: string;
	i18n: TEmbeddedAppProviderI18n;
	mantleApiToken?: string;
	children: React.ReactNode;
	userContext: TEmbeddedAppProviderUserContext;
	disabledCrisp?: boolean;
	disabledCrispCallbacks?: boolean;
	disabledMantle?: boolean;
}

export interface TEmbeddedAppProviderUserContext {
	identifier: string;
	email?: string;
	name?: string;
	companyName?: string;
	avatarUrl?: string;
	additionalData?: Record<string, unknown>;
}

export type TEmbeddedAppProviderI18n = ConstructorParameters<typeof I18n>[0];

const PolarisLink = React.forwardRef<HTMLAnchorElement, LinkLikeComponentProps>((props, ref) => (
	<Link {...props} to={props.url ?? props['to']} ref={ref} />
)) as LinkLikeComponent;
PolarisLink.displayName = 'PolarisLink';
