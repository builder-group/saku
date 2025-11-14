import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export const RootProviders: React.FC<TRootProvidersProps> = (props) => {
	const { children } = props;

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

interface TRootProvidersProps {
	children: React.ReactNode;
}
