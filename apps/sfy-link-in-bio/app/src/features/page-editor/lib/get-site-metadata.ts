import { TResolvedSite } from '@/features/page-editor';
import { TMetaFunction } from '@/types';

export function getSiteMetadata(site: TResolvedSite | null): ReturnType<TMetaFunction> {
	if (site == null) {
		return [
			{ title: 'Page Not Found - Saku' },
			{
				name: 'description',
				content: 'The requested page could not be found'
			}
		];
	}

	return [
		{ title: site.root.content.metadata.title },
		{
			name: 'description',
			content: site.root.content.metadata.description
		},
		{
			property: 'og:title',
			content: site.root.content.metadata.title
		},
		{
			property: 'og:description',
			content: site.root.content.metadata.description
		}
	];
}
