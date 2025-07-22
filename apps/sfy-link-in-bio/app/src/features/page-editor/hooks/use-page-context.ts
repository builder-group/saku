import { useQuery } from '@tanstack/react-query';
import { createPageContext, TCreatePageContextConfig } from '../lib';

export function usePageContext(config: TCreatePageContextConfig) {
	return useQuery({
		queryKey: ['pageContext', config.siteId],
		queryFn: async () => (await createPageContext(config)).unwrap()
	});
}
