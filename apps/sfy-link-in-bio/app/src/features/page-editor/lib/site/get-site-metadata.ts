import { TResolvedSite } from '@/features/page-editor';
import { TMetaFunction } from '@/types';

// https://api.reactrouter.com/v7/types/react_router.MetaDescriptor.html
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

	const metadata = [
		{ tagName: 'link', rel: 'icon', href: site.root.content.metadata.favicon },
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
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image'
		},
		{
			name: 'twitter:title',
			content: site.root.content.metadata.title
		},
		{
			name: 'twitter:description',
			content: site.root.content.metadata.description
		}
	];

	// Add OpenGraph image if available
	if (site.root.content.metadata.image != null) {
		metadata.push({
			property: 'og:image',
			content: site.root.content.metadata.image
		});
		metadata.push({
			name: 'twitter:image',
			content: site.root.content.metadata.image
		});
	}

	return metadata;
}
