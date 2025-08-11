import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ChatwootProvider, PosthogProvider } from '@/components';

const queryClient = new QueryClient();

export const RootProviders: React.FC<TRootProvidersProps> = (props) => {
	const { children } = props;

	return (
		<QueryClientProvider client={queryClient}>
			<PosthogProvider>
				<ChatwootProvider>{children}</ChatwootProvider>
			</PosthogProvider>
		</QueryClientProvider>
	);
};

interface TRootProvidersProps {
	children: React.ReactNode;
}
