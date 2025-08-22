import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { PosthogProvider } from '@/components';
import { appConfig } from '@/environment';

const queryClient = new QueryClient();

export const RootProviders: React.FC<TRootProvidersProps> = (props) => {
	const { children } = props;

	return (
		<QueryClientProvider client={queryClient}>
			<PosthogProvider disabled={!appConfig.featureFlags.posthog}>{children}</PosthogProvider>
		</QueryClientProvider>
	);
};

interface TRootProvidersProps {
	children: React.ReactNode;
}
