import { useQuery } from '@tanstack/react-query';
import { createPageEditor, TCreatePageEditorConfig } from '../lib';

export function usePageEditor(config: TCreatePageEditorConfig) {
	return useQuery({
		queryKey: ['pageEditor', config.site.id],
		queryFn: async () => (await createPageEditor(config)).unwrap()
	});
}
